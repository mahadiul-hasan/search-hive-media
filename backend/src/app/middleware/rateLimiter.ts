import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../../shared/redis";
import { Request, Response } from "express";

export const globalRateLimiter = rateLimit({
	store: new RedisStore({
		sendCommand: (...args: string[]) => redisClient.sendCommand(args),
	}),
	keyGenerator: (req) => {
		const deviceId = req.headers["x-device-id"];
		if (typeof deviceId === "string" && deviceId.trim() !== "") {
			return deviceId;
		}
		return req.ip || "unknown";
	},
	windowMs: 60 * 1000, // 1 minute
	max: 40,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req: Request, res: Response) => {
		res.status(429).json({
			success: false,
			message: "Too many requests. Please try again later.",
		});
	},
});
