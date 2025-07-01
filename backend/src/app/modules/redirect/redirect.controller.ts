import { Request, Response } from "express";
import moment from "moment-timezone";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import { SearchStat } from "../searchStat/searchStat.model";
import redisClient from "../../../shared/redis";
import httpStatus from "http-status";
import { ApiError } from "../../../errors/ApiError";

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

	// Step 1: Fetch feed (from Redis or DB)
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

	// Step 2: Block duplicate IP click within 5s window
	const blockKey = `click_limit:${shortUrl}:${userIp}`;
	const isDuplicateClick = await redisClient.get(blockKey);
	const key = req.query.query as string;
	const redirectUrl = key
		? `${feed.original_url.replace(/\/$/, "")}/${encodeURIComponent(key)}`
		: feed.original_url;

	if (isDuplicateClick) {
		return res.redirect(redirectUrl);
	}
	await redisClient.setEx(blockKey, 5, "1");

	// Step 3: Hourly timestamp (Asia/Dhaka)
	const TIMEZONE = "Asia/Dhaka";
	const now = moment().tz(TIMEZONE);
	const hourStart = now.startOf("hour").toDate();

	let stat = await SearchStat.findOne({
		searchFeed: feed._id,
		user: feed.user,
		createdAt: hourStart,
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
			createdAt: hourStart,
		});
		await stat.save();
	}

	// Step 4: Unique IP tracking
	const ipKey = `unique_ips:${stat._id.toString()}`;
	const isNewIp = await redisClient.sAdd(ipKey, userIp);
	if (isNewIp === 1) {
		await redisClient.expire(ipKey, 3600); // 1 hour expiry
	}

	// Step 5: Update stat
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

	// Step 6: Redirect
	res.redirect(redirectUrl);
};

export const RedirectController = {
	handleShortUrlClick,
};
