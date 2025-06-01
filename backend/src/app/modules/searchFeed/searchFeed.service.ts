import { nanoid } from "nanoid";
import { SearchFeed } from "./searchFeed.model";
import { ISearchFeed } from "./searchFeed.interface";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";
import redisClient from "../../../shared/redis";

const createSearchFeed = async (data: ISearchFeed) => {
	const slug = nanoid(6);
	const createData = {
		...data,
		short_url: slug,
	};

	const result = await SearchFeed.create(createData);

	// Store the necessary SearchFeed data in Redis
	const redisData = {
		_id: result._id,
		original_url: result.original_url,
		countries: result.countries || [],
		user: result.user,
	};

	await redisClient.setEx(
		`short_url_obj:${slug}`,
		86400,
		JSON.stringify(redisData)
	);

	return result;
};

const updateSearchFeed = async (data: Partial<ISearchFeed>, id: string) => {
	const existing = await SearchFeed.findById(id);
	if (!existing) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}

	const originalUrlChanged =
		data.original_url !== undefined &&
		data.original_url !== existing.original_url;

	const countriesChanged =
		data.countries !== undefined &&
		JSON.stringify(data.countries) !== JSON.stringify(existing.countries);

	let newShortUrl = existing.short_url;

	if (originalUrlChanged) {
		newShortUrl = nanoid(6);
		data.short_url = newShortUrl;
	}

	// Handle countries update with proper typing
	if (data.countries !== undefined) {
		data.countries = Array.isArray(data.countries)
			? ([...data.countries] as [string])
			: undefined;
	}

	const updated = await SearchFeed.findByIdAndUpdate(id, data, { new: true });
	if (!updated) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Failed to update search feed"
		);
	}

	if (originalUrlChanged || countriesChanged) {
		// Delete old Redis key if URL changed
		if (originalUrlChanged) {
			await redisClient.del(`short_url_obj:${existing.short_url}`);
		}

		// Create/update Redis entry with new data
		const redisData = {
			_id: updated._id,
			original_url: updated.original_url,
			countries: updated.countries || [], // Use empty array for Redis if undefined
			user: updated.user,
		};

		await redisClient.setEx(
			`short_url_obj:${newShortUrl}`,
			86400,
			JSON.stringify(redisData)
		);
	}

	return updated;
};

const getAllSearchFeed = async () => {
	const result = await SearchFeed.find({})
		.populate({
			path: "user",
			select: "-password",
		})
		.select("-short_url");

	return result;
};

const getSingleSearchFeed = async (id: string) => {
	const result = await SearchFeed.findById(id)
		.populate({
			path: "user",
			select: "-password",
		})
		.select("-short_url");
	return result;
};

const getMySearchFeed = async (id: string) => {
	const result = await SearchFeed.find({ user: id, status: "active" })
		.populate({
			path: "user",
			select: "-password",
		})
		.select("-original_url");

	return result;
};

const deleteSearchFeed = async (id: string) => {
	const existing = await SearchFeed.findById(id);
	if (!existing) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Search feed not found");
	}
	const result = await SearchFeed.findByIdAndDelete(id);

	await redisClient.del(`short_url:${existing.short_url}`);

	return result;
};

export const SearchFeedService = {
	createSearchFeed,
	updateSearchFeed,
	getAllSearchFeed,
	getSingleSearchFeed,
	getMySearchFeed,
	deleteSearchFeed,
};
