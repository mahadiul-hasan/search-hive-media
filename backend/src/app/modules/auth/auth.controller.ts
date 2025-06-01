import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import config from "../../../config";
import { IRefreshTokenResponse } from "./auth.interface";

const login = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.login(req.body);
	const { refreshToken, ...others } = result;

	// set refresh token into cookie
	const cookieOptions = {
		secure: config.env === "production",
		httpOnly: true,
	};

	res.cookie("refreshToken", refreshToken, cookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Logged in successfully",
		data: others,
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const { refreshToken } = req.cookies;
	const result = await AuthService.RefreshToken(refreshToken);

	// set refresh token into cookie
	const cookieOptions = {
		secure: config.env === "production",
		httpOnly: true,
	};

	res.cookie("refreshToken", refreshToken, cookieOptions);

	sendResponse<IRefreshTokenResponse>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User Login successful",
		data: result,
	});
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
	const { ...passwordData } = req.body;
	const user = req.user;
	await AuthService.ChangePassword(user, passwordData);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User password change successfully",
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;
	await AuthService.forgotPassword(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Please check your email for reset password link",
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { token, password } = req.body;
	await AuthService.resetPassword(token, password);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password reset successfully",
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: config.env === "production",
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User Logout successfully",
		data: { message: "Logout successfully" },
	});
});

export const AuthController = {
	login,
	refreshToken,
	changePassword,
	logout,
	forgotPassword,
	resetPassword,
};
