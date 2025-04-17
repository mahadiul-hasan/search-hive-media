import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const createUser = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.createUser(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User created successfully",
		data: result,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const result = await UserService.getAllUsers();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users fetched successfully",
		data: result,
	});
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await UserService.getUserById(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Users fetched successfully",
		data: result,
	});
});

const updateUserByAdmin = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await UserService.updateUserByAdmin(id, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User updated successfully",
		data: result,
	});
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await UserService.deleteUser(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User deleted successfully",
	});
});

const updateOwnProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?._id;
	const { email, role, balance, ...filteredBody } = req.body;
	const updatedUser = await UserService.updateOwnProfile(
		userId,
		filteredBody
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile updated successfully",
		data: updatedUser,
	});
});

const getOwnProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?._id;
	const user = await UserService.getOwnProfile(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile retrieved successfully",
		data: user,
	});
});

export const UserController = {
	createUser,
	getAllUsers,
	updateUserByAdmin,
	deleteUser,
	updateOwnProfile,
	getOwnProfile,
	getUserById,
};
