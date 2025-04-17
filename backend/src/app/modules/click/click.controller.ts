import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ClickService } from "./click.service";

const getTotalClicks = catchAsync(async (req: Request, res: Response) => {
	const { shortUrl } = req.params;
	const result = await ClickService.getTotalClicks(shortUrl);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Clicks retrieved successfully",
		data: result,
	});
});

const getAllShortUrl = catchAsync(async (req: Request, res: Response) => {
	const result = await ClickService.getAllShortUrl();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Short Urls retrieved successfully",
		data: result,
	});
});

export const ClickController = {
	getTotalClicks,
	getAllShortUrl,
};
