import dayjs from "dayjs";
import { ApiError } from "../../../errors/ApiError";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import httpStatus from "http-status";
import { Click } from "./click.model";
import { ISearchFeed } from "../searchFeed/searchFeed.interface";

const getTotalClicks = async (shortUrl: string) => {
	// Find the SearchFeed associated with the shortUrl
	const feed = await SearchFeed.findOne({ short_url: shortUrl });

	if (!feed) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Short URL not found");
	}

	// Get total clicks from the past 24 hours
	const today = dayjs().format("YYYY-MM-DD");
	const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

	const todayClicks = await Click.findOne({
		searchFeedId: feed._id,
		date: today,
	});
	const yesterdayClicks = await Click.findOne({
		searchFeedId: feed._id,
		date: yesterday,
	});

	// Get total clicks for all dates, for filtering
	const allClicks = await Click.find({ searchFeedId: feed._id });

	return {
		shortUrl: feed.short_url,
		totalClicks: todayClicks ? todayClicks.clicks : 0,
		clicksToday: todayClicks ? todayClicks.clicks : 0,
		clicksYesterday: yesterdayClicks ? yesterdayClicks.clicks : 0,
		allClicks,
	};
};

const getAllShortUrl = async () => {
	const result = await SearchFeed.find({}, { name: 1, short_url: 1, _id: 0 });
	return result;
};

export const ClickService = {
	getTotalClicks,
	getAllShortUrl,
};
