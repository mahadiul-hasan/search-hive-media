import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DashboardService } from "./dashboard.service";
import { ApiError } from "../../../errors/ApiError";

const getAdminDashboardStat = catchAsync(
	async (req: Request, res: Response) => {
		const result = await DashboardService.getAdminDashboardStat();

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Dashboard Data retrieved successfully",
			data: result,
		});
	}
);

const getUserDashboardStat = catchAsync(async (req: Request, res: Response) => {
	const id = req?.user?._id;
	if (!id) {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
	}
	const result = await DashboardService.getUserDashboardStat(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Dashboard Data retrieved successfully",
		data: result,
	});
});

export const DashboardController = {
	getAdminDashboardStat,
	getUserDashboardStat,
};
