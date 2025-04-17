import { ApiError } from "../../../errors/ApiError";
import redisClient from "../../../shared/redis";
import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";
import httpStatus from "http-status";

const createContact = async (data: IContact) => {
	const contact = await Contact.create(data);
	await redisClient.del("contact:all");
	return contact;
};

const getAllContacts = async () => {
	const cacheKey = "contact:all";
	// Try to get from Redis
	const cachedContacts = await redisClient.get(cacheKey);
	if (cachedContacts) {
		return JSON.parse(cachedContacts);
	}
	// If not in cache, fetch from MongoDB
	const contacts = await Contact.find({}).sort({ createdAt: -1 });
	await redisClient.set(cacheKey, JSON.stringify(contacts));
	return contacts;
};

const deleteContact = async (id: string) => {
	const contact = await Contact.findByIdAndDelete(id);
	if (!contact) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Contact not found");
	}
	// Delete the contact from Redis cache
	await redisClient.del("contact:all");
	return contact;
};

export const ContactService = {
	createContact,
	getAllContacts,
	deleteContact,
};
