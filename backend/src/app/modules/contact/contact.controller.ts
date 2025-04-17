import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ContactService } from "./contact.service";

const createContact = catchAsync(async (req: Request, res: Response) => {
	await ContactService.createContact(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Form submitted successfully",
	});
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
	const result = await ContactService.getAllContacts();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Contacts retrieved successfully",
		data: result,
	});
});

const deleteContact = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	await ContactService.deleteContact(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Contact deleted successfully",
	});
});

export const ContactController = {
	createContact,
	deleteContact,
	getAllContacts,
};
