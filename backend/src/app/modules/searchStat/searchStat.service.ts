import { SearchStat } from "./searchStat.model";
import { ISearchStat, SearchStatFilters } from "./searchStat.interface";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Types } from "mongoose";
import moment from "moment-timezone";

const updateSearchStat = async (data: Partial<ISearchStat>, id: string) => {
	const existing = await SearchStat.findById(id);

	if (!existing) {
		throw new ApiError(httpStatus.NOT_FOUND, "Search stat not found");
	}

	// Prevent changing the search_feed_id
	if (
		data.searchFeed &&
		data.searchFeed.toString() !== existing.searchFeed.toString()
	) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"Changing searchFeed is not allowed"
		);
	}

	const TIMEZONE = "Asia/Dhaka";

	// Detect granularity from existing.createdAt
	const createdAtMoment = moment(existing.createdAt).tz(TIMEZONE);
	let groupBy: "hour" | "day" | "month" = "day";

	if (
		createdAtMoment.hour() !== 0 ||
		createdAtMoment.minute() !== 0 ||
		createdAtMoment.second() !== 0
	) {
		groupBy = "hour";
	} else if (createdAtMoment.date() !== 1) {
		groupBy = "day";
	} else {
		groupBy = "month";
	}

	// Adjust new createdAt to match detected granularity
	if (data.createdAt) {
		const m = moment(data.createdAt).tz(TIMEZONE);
		switch (groupBy) {
			case "hour":
				data.createdAt = m.startOf("hour").toDate();
				break;
			case "day":
				data.createdAt = m.startOf("day").toDate();
				break;
			case "month":
				data.createdAt = m.startOf("month").toDate();
				break;
		}
	}

	const updated = await SearchStat.findByIdAndUpdate(id, data, { new: true })
		.select("-short_url")
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-short_url",
		});

	return updated;
};

const getAllSearchStat = async (
	filters: SearchStatFilters & {
		groupBy?: "day" | "month";
		page?: number;
		limit?: number;
	}
): Promise<{
	stats: ISearchStat[];
	total: number;
	totalSearches: number;
	totalRevenue: number;
}> => {
	const {
		dateFilter = "today",
		customRange = {} as { from?: string; to?: string },
		searchFeedId,
		groupBy = "day",
		page = 1,
		limit = 10,
	} = filters;

	const query: any = {};
	let startDate: Date | undefined;
	let endDate: Date | undefined;

	// Date range calculation
	const TIMEZONE = "Asia/Dhaka";

	switch (dateFilter) {
		case "today":
			startDate = moment().tz(TIMEZONE).startOf("day").toDate();
			endDate = moment().tz(TIMEZONE).toDate();
			break;
		case "yesterday":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "day")
				.startOf("day")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "day")
				.endOf("day")
				.toDate();
			break;
		case "this_week":
			startDate = moment().tz(TIMEZONE).startOf("week").toDate();
			endDate = moment().tz(TIMEZONE).endOf("week").toDate();
			break;
		case "last_week":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "week")
				.startOf("week")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "week")
				.endOf("week")
				.toDate();
			break;
		case "this_month":
			startDate = moment().tz(TIMEZONE).startOf("month").toDate();
			endDate = moment().tz(TIMEZONE).endOf("month").toDate();
			break;
		case "last_month":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "month")
				.startOf("month")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "month")
				.endOf("month")
				.toDate();
			break;
		case "custom":
			if (customRange.from && customRange.to) {
				startDate = moment(customRange.from)
					.tz(TIMEZONE)
					.startOf("day")
					.toDate();
				endDate = moment(customRange.to)
					.tz(TIMEZONE)
					.endOf("day")
					.toDate();
			}
			break;
	}

	if (startDate && endDate) {
		query.createdAt = {
			$gte: startDate,
			$lte: endDate,
		};
	}

	if (searchFeedId) {
		query.searchFeed = new Types.ObjectId(searchFeedId);
	}

	// Main aggregation pipeline
	const pipeline: any[] = [];

	// 1. Initial match
	if (Object.keys(query).length > 0) {
		pipeline.push({ $match: query });
	}

	// 2. Preserve original _id before grouping
	pipeline.push({
		$addFields: {
			originalId: "$_id",
		},
	});

	// 3. Lookup for user name
	pipeline.push(
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "userData",
			},
		},
		{ $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
		{ $addFields: { userId: "$userData.id" } }
	);

	// 4. Lookup for searchFeed name
	pipeline.push(
		{
			$lookup: {
				from: "searchfeeds",
				localField: "searchFeed",
				foreignField: "_id",
				as: "searchFeedData",
			},
		},
		{
			$unwind: {
				path: "$searchFeedData",
				preserveNullAndEmptyArrays: true,
			},
		},
		{ $addFields: { searchFeedName: "$searchFeedData.name" } }
	);

	// 5. Determine date format based on groupBy
	// 5. Determine date format based on groupBy
	const allowedGroupBy = ["day", "month"] as const;
	const validGroupBy: "day" | "month" = allowedGroupBy.includes(
		groupBy as any
	)
		? (groupBy as "day" | "month")
		: "day";

	let groupDateFormat;
	switch (validGroupBy) {
		case "day":
			groupDateFormat = "%Y-%m-%d";
			break;
		case "month":
			groupDateFormat = "%Y-%m";
			break;
		default:
			groupDateFormat = "%Y-%m-%d";
	}

	// Grouping stage with dynamic date format
	const groupStage = {
		$group: {
			_id: {
				date: {
					$dateToString: {
						format: groupDateFormat,
						date: "$createdAt",
						timezone: "+06:00",
					},
				},
				searchFeed: "$searchFeed",
				user: "$user",
			},
			originalIds: { $push: "$originalId" },
			searches: { $sum: "$searches" },
			valid: { $sum: "$valid" },
			mistake: { $sum: "$mistake" },
			monetized: { $sum: "$monetized" },
			unique_ips: { $sum: "$unique_ips" },
			visitors: { $sum: "$visitors" },
			clicks: { $sum: "$clicks" },
			revenue: { $sum: "$revenue" },
			firstCreatedAt: { $first: "$createdAt" },
			ctr: { $avg: "$ctr" },
			coverage: { $avg: "$coverage" },
			epc: { $avg: "$epc" },
			rpm: { $avg: "$rpm" },
			userId: { $first: "$userId" },
			searchFeedName: { $first: "$searchFeedName" },
		},
	};

	pipeline.push(groupStage);

	// 6. Project to final structure
	const projectStage = {
		_id: "$_id",
		originalIds: 1,
		date: "$_id.date",
		searches: 1,
		valid: 1,
		mistake: 1,
		monetized: 1,
		unique_ips: 1,
		visitors: 1,
		clicks: 1,
		revenue: 1,
		ctr: 1,
		coverage: 1,
		epc: 1,
		rpm: 1,
		user: {
			_id: "$_id.user",
			userId: "$userId",
		},
		searchFeed: {
			_id: "$_id.searchFeed",
			name: "$searchFeedName",
		},
		createdAt: "$firstCreatedAt",
	};
	pipeline.push({ $project: projectStage });

	// 7. Sorting
	pipeline.push({ $sort: { createdAt: -1 } });

	// 8. Pagination
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	// Execute pipeline for results
	const stats = await SearchStat.aggregate(pipeline);

	// Get total count
	const countPipeline = [...pipeline];
	countPipeline.pop(); // Remove $limit
	countPipeline.pop(); // Remove $skip
	countPipeline.push({ $count: "total" });
	const countResult = await SearchStat.aggregate(countPipeline);
	const total = countResult[0]?.total || 0;

	// Get totals (searches and revenue)
	const totalsPipeline = [...pipeline];
	totalsPipeline.pop(); // Remove $limit
	totalsPipeline.pop(); // Remove $skip
	totalsPipeline.push({
		$group: {
			_id: null,
			totalSearches: { $sum: "$searches" },
			totalRevenue: { $sum: "$revenue" },
		},
	});
	const totalsResult = await SearchStat.aggregate(totalsPipeline);
	const totalSearches = totalsResult[0]?.totalSearches || 0;
	const totalRevenue = totalsResult[0]?.totalRevenue || 0;

	return {
		stats,
		total,
		totalSearches,
		totalRevenue,
	};
};

const getSingleSearchStat = async (id: string) => {
	const stat = await SearchStat.findById(id)
		.select("-short_url")
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-short_url",
		});

	if (!stat) {
		throw new ApiError(httpStatus.NOT_FOUND, "Search stat not found");
	}

	return stat;
};

const getMySearchStat = async (
	filters: SearchStatFilters & {
		groupBy?: "day" | "month";
		page?: number;
		limit?: number;
	},
	userId: Types.ObjectId | string
): Promise<{
	stats: ISearchStat[];
	total: number;
	totalSearches: number;
	totalRevenue: number;
}> => {
	const {
		dateFilter = "today",
		customRange = {} as { from?: string; to?: string },
		searchFeedId,
		groupBy = "day",
		page = 1,
		limit = 10,
	} = filters;

	const query: any = {
		user: new Types.ObjectId(userId),
	};

	let startDate: Date | undefined;
	let endDate: Date | undefined;

	// Date range calculation
	const TIMEZONE = "Asia/Dhaka";

	switch (dateFilter) {
		case "today":
			startDate = moment().tz(TIMEZONE).startOf("day").toDate();
			endDate = moment().tz(TIMEZONE).toDate();
			break;
		case "yesterday":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "day")
				.startOf("day")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "day")
				.endOf("day")
				.toDate();
			break;
		case "this_week":
			startDate = moment().tz(TIMEZONE).startOf("week").toDate();
			endDate = moment().tz(TIMEZONE).endOf("week").toDate();
			break;
		case "last_week":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "week")
				.startOf("week")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "week")
				.endOf("week")
				.toDate();
			break;
		case "this_month":
			startDate = moment().tz(TIMEZONE).startOf("month").toDate();
			endDate = moment().tz(TIMEZONE).endOf("month").toDate();
			break;
		case "last_month":
			startDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "month")
				.startOf("month")
				.toDate();
			endDate = moment()
				.tz(TIMEZONE)
				.subtract(1, "month")
				.endOf("month")
				.toDate();
			break;
		case "custom":
			if (customRange.from && customRange.to) {
				startDate = moment(customRange.from)
					.tz(TIMEZONE)
					.startOf("day")
					.toDate();
				endDate = moment(customRange.to)
					.tz(TIMEZONE)
					.endOf("day")
					.toDate();
			}
			break;
	}

	if (startDate && endDate) {
		query.createdAt = {
			$gte: startDate,
			$lte: endDate,
		};
	}

	if (searchFeedId) {
		query.searchFeed = new Types.ObjectId(searchFeedId);
	}

	// Main aggregation pipeline
	const pipeline: any[] = [];

	// 1. Initial match
	if (Object.keys(query).length > 0) {
		pipeline.push({ $match: query });
	}

	// 2. Preserve original _id before grouping
	pipeline.push({
		$addFields: {
			originalId: "$_id",
		},
	});

	// 3. Lookup for user id
	pipeline.push(
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "userData",
			},
		},
		{ $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
		{ $addFields: { userId: "$userData.id" } }
	);

	// 4. Lookup for searchFeed name
	pipeline.push(
		{
			$lookup: {
				from: "searchfeeds",
				localField: "searchFeed",
				foreignField: "_id",
				as: "searchFeedData",
			},
		},
		{
			$unwind: {
				path: "$searchFeedData",
				preserveNullAndEmptyArrays: true,
			},
		},
		{ $addFields: { searchFeedName: "$searchFeedData.name" } }
	);

	// 5. Determine date format based on groupBy
	const allowedGroupBy = ["day", "month"] as const;
	const validGroupBy: "day" | "month" = allowedGroupBy.includes(
		groupBy as any
	)
		? (groupBy as "day" | "month")
		: "day";

	let groupDateFormat;
	switch (validGroupBy) {
		case "day":
			groupDateFormat = "%Y-%m-%d";
			break;
		case "month":
			groupDateFormat = "%Y-%m";
			break;
		default:
			groupDateFormat = "%Y-%m-%d";
	}

	// Grouping stage with dynamic date format
	const groupStage = {
		$group: {
			_id: {
				date: {
					$dateToString: {
						format: groupDateFormat,
						date: "$createdAt",
						timezone: "+06:00",
					},
				},
				searchFeed: "$searchFeed",
				user: "$user",
			},
			originalIds: { $push: "$originalId" },
			searches: { $sum: "$searches" },
			valid: { $sum: "$valid" },
			mistake: { $sum: "$mistake" },
			monetized: { $sum: "$monetized" },
			unique_ips: { $sum: "$unique_ips" },
			visitors: { $sum: "$visitors" },
			clicks: { $sum: "$clicks" },
			revenue: { $sum: "$revenue" },
			firstCreatedAt: { $first: "$createdAt" },
			ctr: { $avg: "$ctr" },
			coverage: { $avg: "$coverage" },
			epc: { $avg: "$epc" },
			rpm: { $avg: "$rpm" },
			userId: { $first: "$userId" },
			searchFeedName: { $first: "$searchFeedName" },
		},
	};

	pipeline.push(groupStage);

	// 6. Project to final structure
	const projectStage = {
		_id: "$_id",
		originalIds: 1,
		date: "$_id.date",
		searches: 1,
		valid: 1,
		mistake: 1,
		monetized: 1,
		unique_ips: 1,
		visitors: 1,
		clicks: 1,
		revenue: 1,
		ctr: 1,
		coverage: 1,
		epc: 1,
		rpm: 1,
		user: {
			_id: "$_id.user",
			userId: "$userId",
		},
		searchFeed: {
			_id: "$_id.searchFeed",
			name: "$searchFeedName",
		},
		createdAt: "$firstCreatedAt",
	};
	pipeline.push({ $project: projectStage });

	// 7. Sorting
	pipeline.push({ $sort: { createdAt: -1 } });

	// 8. Pagination
	pipeline.push({ $skip: (page - 1) * limit });
	pipeline.push({ $limit: limit });

	// Execute pipeline for results
	const stats = await SearchStat.aggregate(pipeline);

	// Get total count
	const countPipeline = [...pipeline];
	countPipeline.pop(); // Remove $limit
	countPipeline.pop(); // Remove $skip
	countPipeline.push({ $count: "total" });
	const countResult = await SearchStat.aggregate(countPipeline);
	const total = countResult[0]?.total || 0;

	// Get totals (searches and revenue)
	const totalsPipeline = [...pipeline];
	totalsPipeline.pop(); // Remove $limit
	totalsPipeline.pop(); // Remove $skip
	totalsPipeline.push({
		$group: {
			_id: null,
			totalSearches: { $sum: "$searches" },
			totalRevenue: { $sum: "$revenue" },
		},
	});
	const totalsResult = await SearchStat.aggregate(totalsPipeline);
	const totalSearches = totalsResult[0]?.totalSearches || 0;
	const totalRevenue = totalsResult[0]?.totalRevenue || 0;

	return {
		stats,
		total,
		totalSearches,
		totalRevenue,
	};
};

const deleteSearchStat = async (id: string) => {
	const existing = await SearchStat.findById(id);
	if (!existing) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}
	const result = await SearchStat.findByIdAndDelete(id);

	return result;
};

const deleteMultipleSearchStats = async (ids: string[]) => {
	const result = await SearchStat.deleteMany({ _id: { $in: ids } });

	if (result.deletedCount === 0) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			"No search feeds were found or deleted"
		);
	}

	return {
		deletedCount: result.deletedCount,
		deletedIds: ids,
	};
};

export const SearchStatService = {
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
	deleteMultipleSearchStats,
};
