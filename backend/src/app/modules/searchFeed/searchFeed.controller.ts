import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SearchFeedService } from "./searchFeed.service";
import { ApiError } from "../../../errors/ApiError";

const createSearchFeed = catchAsync(async (req: Request, res: Response) => {
	await SearchFeedService.createSearchFeed(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Search Feed created successfully",
	});
});

const updateSearchFeed = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	await SearchFeedService.updateSearchFeed(req.body, id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Feed created successfully",
	});
});

const getAllSearchFeed = catchAsync(async (req: Request, res: Response) => {
	const result = await SearchFeedService.getAllSearchFeed();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Feeds retrieved successfully",
		data: result,
	});
});

const getSingleSearchFeed = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	const result = await SearchFeedService.getSingleSearchFeed(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Feed retrieved successfully",
		data: result,
	});
});

const getMySearchFeed = catchAsync(async (req: Request, res: Response) => {
	const id = req?.user?._id;
	if (!id) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User ID not found");
	}
	const result = await SearchFeedService.getMySearchFeed(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Feed retrieved successfully",
		data: result,
	});
});

const deleteSearchFeed = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id;
	await SearchFeedService.deleteSearchFeed(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Search Feed deleted successfully",
	});
});

export const SearchFeedController = {
	createSearchFeed,
	updateSearchFeed,
	getAllSearchFeed,
	getSingleSearchFeed,
	getMySearchFeed,
	deleteSearchFeed,
};
