import { SearchStat } from "./searchStat.model";
import { ISearchStat, SearchStatFilters } from "./searchStat.interface";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { Types } from "mongoose";

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
	filters: SearchStatFilters
): Promise<ISearchStat[]> => {
	const {
		dateFilter = "today",
		customRange = {} as { from?: string; to?: string },
		searchFeedId,
	} = filters;

	const query: any = {};

	let startDate: Date | undefined;
	let endDate: Date | undefined;

	switch (dateFilter) {
		case "today":
			startDate = moment().startOf("day").toDate();
			endDate = moment().endOf("day").toDate();
			break;
		case "yesterday":
			startDate = moment().subtract(1, "day").startOf("day").toDate();
			endDate = moment().subtract(1, "day").endOf("day").toDate();
			break;
		case "this_week":
			startDate = moment().startOf("week").toDate();
			endDate = moment().endOf("week").toDate();
			break;
		case "last_week":
			startDate = moment().subtract(1, "week").startOf("week").toDate();
			endDate = moment().subtract(1, "week").endOf("week").toDate();
			break;
		case "this_month":
			startDate = moment().startOf("month").toDate();
			endDate = moment().endOf("month").toDate();
			break;
		case "last_month":
			startDate = moment().subtract(1, "month").startOf("month").toDate();
			endDate = moment().subtract(1, "month").endOf("month").toDate();
			break;
		case "custom":
			if (customRange.from && customRange.to) {
				startDate = moment(customRange.from).startOf("day").toDate();
				endDate = moment(customRange.to).endOf("day").toDate();
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

	const searchStats = await SearchStat.find(query)
		.select("-short_url")
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-short_url",
		});

	return searchStats;
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
	filters: SearchStatFilters,
	userId: Types.ObjectId
): Promise<ISearchStat[]> => {
	const {
		dateFilter = "today",
		customRange = {} as { from?: string; to?: string },
		searchFeedId,
	} = filters;

	const query: any = {
		user: userId,
	};

	let startDate: Date | undefined;
	let endDate: Date | undefined;

	switch (dateFilter) {
		case "today":
			startDate = moment().startOf("day").toDate();
			endDate = moment().endOf("day").toDate();
			break;
		case "yesterday":
			startDate = moment().subtract(1, "day").startOf("day").toDate();
			endDate = moment().subtract(1, "day").endOf("day").toDate();
			break;
		case "this_week":
			startDate = moment().startOf("week").toDate();
			endDate = moment().endOf("week").toDate();
			break;
		case "last_week":
			startDate = moment().subtract(1, "week").startOf("week").toDate();
			endDate = moment().subtract(1, "week").endOf("week").toDate();
			break;
		case "this_month":
			startDate = moment().startOf("month").toDate();
			endDate = moment().endOf("month").toDate();
			break;
		case "last_month":
			startDate = moment().subtract(1, "month").startOf("month").toDate();
			endDate = moment().subtract(1, "month").endOf("month").toDate();
			break;
		case "custom":
			if (customRange.from && customRange.to) {
				startDate = moment(customRange.from).startOf("day").toDate();
				endDate = moment(customRange.to).endOf("day").toDate();
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

	const searchStats = await SearchStat.find(query)
		.select("-short_url")
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-short_url",
		});

	return searchStats;
};

const deleteSearchStat = async (id: string) => {
	const existing = await SearchStat.findById(id);
	if (!existing) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}
	const result = await SearchStat.findByIdAndDelete(id);

	return result;
};

export const SearchStatService = {
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
};
