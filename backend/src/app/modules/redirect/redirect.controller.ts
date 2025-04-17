import { Request, Response } from "express";
import dayjs from "dayjs";
import redisClient from "../../../shared/redis";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import { Click } from "../click/click.model";
import { ApiError } from "../../../errors/ApiError";
import httpStatus from "http-status";

const handleShortUrlClick = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { shortUrl } = req.params;
	const today = dayjs().format("YYYY-MM-DD");

	// Try fetching from Redis cache first
	let redisData = await redisClient.get(`short_url_obj:${shortUrl}`);
	let feed;

	if (redisData) {
		feed = JSON.parse(redisData);
	} else {
		// If not in cache, query MongoDB
		feed = await SearchFeed.findOne({ short_url: shortUrl }).lean();
		if (!feed) {
			throw new ApiError(httpStatus.BAD_GATEWAY, "Short URL not found");
		}

		// Cache it for 24 hours
		await redisClient.setEx(
			`short_url_obj:${shortUrl}`,
			86400,
			JSON.stringify({ _id: feed._id, original_url: feed.original_url })
		);
	}

	// Increment the click count for today
	await Click.findOneAndUpdate(
		{ searchFeedId: feed._id, date: today },
		{ $inc: { clicks: 1 } },
		{ upsert: true, new: true }
	);

	// Redirect the user to the original URL
	res.redirect(feed.original_url);
};

export const RedirectController = {
	handleShortUrlClick,
};
