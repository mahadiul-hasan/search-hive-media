import { Request, Response } from "express";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import { SearchStat } from "../searchStat/searchStat.model";
import redisClient from "../../../shared/redis";
import httpStatus from "http-status";
import { ApiError } from "../../../errors/ApiError";

dayjs.extend(utc);
dayjs.extend(timezone);

const handleShortUrlClick = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { shortUrl } = req.params;
	const userCountry =
		req.headers["cf-ipcountry"] || req.query.country || "BD";
	const userIp = req.headers["cf-connecting-ip"] || req.query.ip;

	let feed;
	const redisData = await redisClient.get(`short_url_obj:${shortUrl}`);

	if (redisData) {
		feed = JSON.parse(redisData);
	} else {
		feed = await SearchFeed.findOne({ short_url: shortUrl }).lean();
		if (!feed)
			throw new ApiError(httpStatus.NOT_FOUND, "Short URL not found");

		await redisClient.setEx(
			`short_url_obj:${shortUrl}`,
			86400,
			JSON.stringify({
				_id: feed._id,
				user: feed.user,
				countries: feed.countries,
				original_url: feed.original_url,
			})
		);
	}

	// 🕐 Get current BD day range
	const nowBD = dayjs().tz("Asia/Dhaka");
	const startOfDay = nowBD.startOf("day").toDate();
	const endOfDay = nowBD.endOf("day").toDate();

	let stat = await SearchStat.findOne({
		searchFeed: feed._id,
		createdAt: { $gte: startOfDay, $lte: endOfDay },
	});

	if (!stat) {
		stat = new SearchStat({
			searchFeed: feed._id,
			user: feed.user,
			searches: 0,
			valid: 0,
			mistake: 0,
			visitors: 0,
			unique_ips: 0,
		});
		await stat.save(); // Save it so we have _id for Redis
	}

	// Update logic
	stat.searches += 1;
	stat.visitors += 1;

	if (feed.countries.includes(userCountry)) {
		stat.valid += 1;
	} else {
		stat.mistake += 1;
	}

	// Redis IP tracking logic
	const ipKey = `unique_ips:${stat._id}`;
	const isNewIp = userIp
		? await redisClient.sAdd(ipKey, userIp as string)
		: 0;

	if (isNewIp === 1) {
		stat.unique_ips += 1;
		await redisClient.expire(ipKey, 86400); // Ensure Redis TTL is 1 day
	}

	await stat.save();

	res.redirect(feed.original_url);
};

export const RedirectController = {
	handleShortUrlClick,
};
