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

const handleShortUrlClick = async (req: Request, res: Response) => {
	const { shortUrl } = req.params;

	const userCountry =
		(req.headers["cf-ipcountry"] as string) ||
		(req.query.country as string) ||
		"BD";

	const normalizedCountry = userCountry.toUpperCase();

	const userIp =
		(req.headers["cf-connecting-ip"] as string) ||
		(req.query.ip as string) ||
		req.ip ||
		"unknown";

	// Step 1: Get cached feed or fetch from DB
	let feed;
	const redisData = await redisClient.get(`short_url_obj:${shortUrl}`);
	if (redisData) {
		feed = JSON.parse(redisData);
	} else {
		feed = await SearchFeed.findOne({ short_url: shortUrl }).lean();
		if (!feed) {
			throw new ApiError(httpStatus.NOT_FOUND, "Short URL not found");
		}
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

	// Step 2: Create or update today's stat document
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
		await stat.save();
	}

	// Step 3: Unique IP check via Redis
	const ipKey = `unique_ips:${stat._id}`;
	const isNewIp = await redisClient.sAdd(ipKey, userIp);
	if (isNewIp === 1) {
		await redisClient.expire(ipKey, 86400);
	}

	// Step 4: Update stats atomically
	await SearchStat.updateOne(
		{ _id: stat._id },
		{
			$inc: {
				searches: 1,
				visitors: 1,
				valid: feed.countries.includes(normalizedCountry) ? 1 : 0,
				mistake: feed.countries.includes(normalizedCountry) ? 0 : 1,
				unique_ips: isNewIp === 1 ? 1 : 0,
			},
		}
	);

	// Step 5: Redirect
	const key = req.query.key as string;
	const redirectUrl = key
		? `${feed.original_url.replace(/\/$/, "")}/${encodeURIComponent(key)}`
		: feed.original_url;

	res.redirect(redirectUrl);
};

export const RedirectController = {
	handleShortUrlClick,
};
