import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SearchStatService } from "./searchStat.service";
import { ApiError } from "../../../errors/ApiError";

const updateSearchStat = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	await SearchStatService.updateSearchStat(req.body, id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Stat created successfully",
	});
});

const getAllSearchStat = catchAsync(async (req: Request, res: Response) => {
	const result = await SearchStatService.getAllSearchStat();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Stats retrieved successfully",
		data: result,
	});
});

const getSingleSearchStat = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const result = await SearchStatService.getSingleSearchStat(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Stat retrieved successfully",
		data: result,
	});
});

const getMySearchStat = catchAsync(async (req: Request, res: Response) => {
	const id = req?.user?._id;
	if (!id) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User ID not found");
	}
	const result = await SearchStatService.getMySearchStat(id, req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Stat retrieved successfully",
		data: result,
	});
});

const deleteSearchStat = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	await SearchStatService.deleteSearchStat(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Stat deleted successfully",
	});
});

export const SearchStatController = {
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
};
