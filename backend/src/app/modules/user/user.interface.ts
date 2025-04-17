import { Model } from "mongoose";

export enum Role {
	USER = "user",
	ADMIN = "admin",
}

export interface IUser extends Document {
	_id?: string;
	name: string;
	email: string;
	password: string;
	role: Role;
	paymentDetails?: {
		method?: string;
		account?: string;
	};
	personalDetails?: {
		phone?: string;
		skype?: string;
		telegram?: string;
		linkedin?: string;
		balance?: string;
		address?: string;
		companyName?: string;
		vat?: string;
		country?: string;
		state?: string;
		zip?: string;
		timezone?: string;
		currency?: string;
	};
}

export type UserModel = {
	isUserExist(
		email: string
	): Promise<Pick<IUser, "_id" | "name" | "email" | "password" | "role">>;
	isPasswordMatch(
		currentPassword: string,
		savedPassword: string
	): Promise<boolean>;
} & Model<IUser>;
