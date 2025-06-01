import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config";

const createAccessToken = (payload: object): string => {
	return jwt.sign(payload, config.jwt.secret as string, {
		expiresIn: "1d",
	});
};

const createResetToken = (payload: object): string => {
	return jwt.sign(payload, config.jwt.reset_secret as string, {
		expiresIn: "1h",
	});
};

const createRefreshToken = (payload: object): string => {
	return jwt.sign(payload, config.jwt.refresh_secret as string, {
		expiresIn: "30d",
	});
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
	return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
	createAccessToken,
	createResetToken,
	createRefreshToken,
	verifyToken,
};
