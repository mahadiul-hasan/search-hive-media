import { ApiError } from "../../../errors/ApiError";
import redisClient from "../../../shared/redis";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

const createUser = async (payload: IUser) => {
	const user = await User.isUserExist(payload.email);

	let role = payload.email === "admin@gmail.com" ? "admin" : "user";

	if (user) {
		throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
	}

	const newUser = new User({
		...payload,
		role, // Assign the determined role
	});

	// Save the new user to the database
	await newUser.save();

	await redisClient.del("users:all");

	return newUser;
};

const getAllUsers = async (): Promise<IUser[]> => {
	const cacheKey = "users:all";

	// Try to get from Redis
	const cachedUsers = await redisClient.get(cacheKey);
	if (cachedUsers) {
		return JSON.parse(cachedUsers);
	}
	const users = await User.find().select("-password");
	await redisClient.setEx(cacheKey, 86400, JSON.stringify(users));
	return users;
};

const getUserById = async (id: string) => {
	const users = await User.findById(id).select("-password");
	return users;
};

const updateUserByAdmin = async (
	id: string,
	payload: Partial<IUser>
): Promise<IUser | null> => {
	const result = await User.findByIdAndUpdate(id, payload, { new: true });
	await redisClient.del("users:all");
	return result;
};

const deleteUser = async (id: string) => {
	const result = await User.findByIdAndDelete(id);
	await redisClient.del("users:all");
	return result;
};

const updateOwnProfile = async (
	userId: string,
	payload: Partial<IUser>
): Promise<IUser | null> => {
	const result = await User.findByIdAndUpdate(userId, payload, { new: true });
	await redisClient.del("users:all");
	return result;
};

const getOwnProfile = async (userId: string): Promise<IUser | null> => {
	const user = await User.findById(userId);
	return user;
};

export const UserService = {
	createUser,
	getAllUsers,
	updateUserByAdmin,
	deleteUser,
	updateOwnProfile,
	getOwnProfile,
	getUserById,
};
