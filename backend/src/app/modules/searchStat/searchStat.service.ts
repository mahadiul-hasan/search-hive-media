import { SearchStat } from "./searchStat.model";
import { ISearchStat } from "./searchStat.interface";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";
import redisClient from "../../../shared/redis";
import dayjs from "dayjs";

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

	// Invalidate Redis cache
	await redisClient.del("searchStat:all");

	return updated;
};

const getAllSearchStat = async () => {
	// Check Redis cache
	const cached = await redisClient.get("searchStat:all");

	if (cached) {
		return JSON.parse(cached);
	}

	// Fetch from DB if not in cache
	const searchStats = await SearchStat.find({})
		.select("-short_url") // exclude short_url
		.populate({
			path: "user",
			select: "-password", // select specific fields as needed
		})
		.populate({
			path: "searchFeed",
			select: "-short_url",
		});

	// Store in Redis cache
	await redisClient.set("searchStat:all", JSON.stringify(searchStats));

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

const getMySearchStat = async (userId: string, filterData: any) => {
	const { filter, startDate, endDate, searchFeedId } = filterData;

	const query: any = { user: userId };

	// Optional: filter by searchFeed._id
	if (searchFeedId) {
		query.searchFeed = searchFeedId;
	}

	// Default: Today's statistics
	if (!filter) {
		query["createdAt"] = {
			$gte: dayjs().startOf("day").toDate(),
			$lte: dayjs().endOf("day").toDate(),
		};
	}

	// Handle filter options
	switch (filter) {
		case "today":
			query["createdAt"] = {
				$gte: dayjs().startOf("day").toDate(),
				$lte: dayjs().endOf("day").toDate(),
			};
			break;
		case "yesterday":
			query["createdAt"] = {
				$gte: dayjs().subtract(1, "day").startOf("day").toDate(),
				$lte: dayjs().subtract(1, "day").endOf("day").toDate(),
			};
			break;
		case "this_week":
			query["createdAt"] = {
				$gte: dayjs().startOf("week").toDate(),
				$lte: dayjs().endOf("week").toDate(),
			};
			break;
		case "last_week":
			query["createdAt"] = {
				$gte: dayjs().subtract(1, "week").startOf("week").toDate(),
				$lte: dayjs().subtract(1, "week").endOf("week").toDate(),
			};
			break;
		case "this_month":
			query["createdAt"] = {
				$gte: dayjs().startOf("month").toDate(),
				$lte: dayjs().endOf("month").toDate(),
			};
			break;
		case "last_month":
			query["createdAt"] = {
				$gte: dayjs().subtract(1, "month").startOf("month").toDate(),
				$lte: dayjs().subtract(1, "month").endOf("month").toDate(),
			};
			break;
		case "custom":
			if (startDate && endDate) {
				query["createdAt"] = {
					$gte: dayjs(startDate as string).toDate(),
					$lte: dayjs(endDate as string).toDate(),
				};
			}
			break;
	}

	const stats = await SearchStat.find(query)
		.lean()
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-original_url",
		});

	return stats;
};

const deleteSearchStat = async (id: string) => {
	const existing = await SearchStat.findById(id);
	if (!existing) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}
	const result = await SearchStat.findByIdAndDelete(id);

	await redisClient.del("searchStat:all");

	return result;
};

export const SearchStatService = {
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
};
