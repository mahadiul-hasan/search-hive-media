import { SearchStat } from "./searchStat.model";
import { ISearchStat } from "./searchStat.interface";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";
import redisClient from "../../../shared/redis";
import { SearchFeed } from "../searchFeed/searchFeed.model";

const createSearchStat = async (data: ISearchStat) => {
	const feed = await SearchFeed.findById(data.searchFeed);

	if (!feed) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}

	data.user = feed.user;

	const result = await SearchStat.create(data);

	await redisClient.del("searchStat:all");

	return result;
};

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

const getMySearchStat = async (userId: string) => {
	const myStats = await SearchStat.find({ user: userId })
		.populate({
			path: "user",
			select: "-password",
		})
		.populate({
			path: "searchFeed",
			select: "-original_url",
		});

	return myStats;
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
	createSearchStat,
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
};
