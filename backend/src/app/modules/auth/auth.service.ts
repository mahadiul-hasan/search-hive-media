import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import { ApiError } from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { User } from "../user/user.model";
import {
	IChengePassword,
	ILogin,
	IRefreshTokenResponse,
} from "./auth.interface";
import httpStatus from "http-status";
import { sendResetEmail } from "../../../helpers/sendMail";

const login = async (payload: ILogin) => {
	const isUserExist = await User.isUserExist(payload.email);

	if (!isUserExist) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist");
	}

	const isPasswordMatched = await User.isPasswordMatch(
		payload.password,
		isUserExist.password
	);

	if (!isPasswordMatched) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
	}

	const { _id, email, name, role } = isUserExist;

	const accessToken = jwtHelpers.createAccessToken({
		_id,
		email,
		name,
		role,
	});

	const refreshToken = jwtHelpers.createRefreshToken({
		_id,
		email,
		name,
		role,
	});

	return {
		accessToken,
		refreshToken,
	};
};

const RefreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
	let verifiedToken = null;
	try {
		verifiedToken = jwtHelpers.verifyToken(
			token,
			config.jwt.refresh_secret as Secret
		);
	} catch (err) {
		throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
	}

	// Check user exists
	const isUserExist = await User.isUserExist(verifiedToken.email);

	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const { _id, email, name, role } = isUserExist;

	//generate new token
	const newAccessToken = jwtHelpers.createAccessToken({
		_id,
		email,
		name,
		role,
	});

	return {
		accessToken: newAccessToken,
	};
};

const ChangePassword = async (
	user: JwtPayload | null,
	payload: IChengePassword
): Promise<void> => {
	const { oldPassword, newPassword } = payload;

	// Check user exists
	const isUserExist = await User.findById(user?._id).select("+password");

	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	// checking old password
	if (
		isUserExist.password &&
		!(await User.isPasswordMatch(oldPassword, isUserExist.password))
	) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED,
			"Old Password is incorrect"
		);
	}

	isUserExist.password = newPassword;

	// updating using save()
	isUserExist.save();
};

const forgotPassword = async (email: string): Promise<void> => {
	const isUserExist = await User.isUserExist(email);
	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	const resetToken = jwtHelpers.createResetToken({
		_id: isUserExist._id,
		email: isUserExist.email,
	});

	// Send reset token via email

	await sendResetEmail(email, resetToken);
};

const resetPassword = async (
	token: string,
	password: string
): Promise<void> => {
	let verifiedToken = null;
	try {
		verifiedToken = jwtHelpers.verifyToken(
			token,
			config.jwt.reset_secret as Secret
		);
	} catch (err) {
		throw new ApiError(httpStatus.FORBIDDEN, "Invalid Reset Token");
	}

	const isUserExist = await User.findById(verifiedToken._id).select(
		"+password"
	);

	if (!isUserExist) {
		throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
	}

	isUserExist.password = password;

	await isUserExist.save();
};

export const AuthService = {
	login,
	RefreshToken,
	ChangePassword,
	forgotPassword,
	resetPassword,
};
