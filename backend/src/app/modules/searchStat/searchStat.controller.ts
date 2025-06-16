import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SearchStatService } from "./searchStat.service";
import { ApiError } from "../../../errors/ApiError";
import { DateFilter, SearchStatFilters } from "./searchStat.interface";

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
	const { dateFilter, searchFeedId, groupBy, page, limit } = req.query;

	// Extract 'customRange[from]' and 'customRange[to]' explicitly
	const from = req.query["customRange[from]"] as string | undefined;
	const to = req.query["customRange[to]"] as string | undefined;

	const filters: SearchStatFilters & {
		groupBy?: "hour" | "day" | "month";
		page?: number;
		limit?: number;
	} = {
		dateFilter: dateFilter as DateFilter | undefined,
		searchFeedId: searchFeedId as string | undefined,
		groupBy: groupBy as "hour" | "day" | "month",
		page: page ? parseInt(page as string) : undefined,
		limit: limit ? parseInt(limit as string) : undefined,
		customRange:
			dateFilter === "custom" && from && to ? { from, to } : undefined,
	};

	const result = await SearchStatService.getAllSearchStat(filters);

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

	const { dateFilter, searchFeedId, groupBy, page, limit } = req.query;

	// Extract 'customRange[from]' and 'customRange[to]' explicitly
	const from = req.query["customRange[from]"] as string | undefined;
	const to = req.query["customRange[to]"] as string | undefined;

	const filters: SearchStatFilters & {
		groupBy?: "hour" | "day" | "month";
		page?: number;
		limit?: number;
	} = {
		dateFilter: dateFilter as DateFilter | undefined,
		searchFeedId: searchFeedId as string | undefined,
		groupBy: groupBy as "hour" | "day" | "month",
		page: page ? parseInt(page as string) : undefined,
		limit: limit ? parseInt(limit as string) : undefined,
		customRange:
			dateFilter === "custom" && from && to ? { from, to } : undefined,
	};

	const result = await SearchStatService.getMySearchStat(filters, id);

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

const deleteMultipleSearchStats = catchAsync(
	async (req: Request, res: Response) => {
		const ids = req.body.ids;
		if (!Array.isArray(ids) || ids.length === 0) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID list");
		}

		await SearchStatService.deleteMultipleSearchStats(ids);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Search Stat deleted successfully",
		});
	}
);

export const SearchStatController = {
	updateSearchStat,
	getAllSearchStat,
	getSingleSearchStat,
	getMySearchStat,
	deleteSearchStat,
	deleteMultipleSearchStats,
};
