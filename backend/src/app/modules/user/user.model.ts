import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { IUser, Role, UserModel } from "./user.interface";

// PaymentDetails schema
const PaymentDetailsSchema = new Schema({
	method: { type: String },
	account: { type: String },
});

// PersonalDetails schema
const PersonalDetailsSchema = new Schema({
	phone: { type: String, default: "" },
	skype: { type: String, default: "" },
	telegram: { type: String, default: "" },
	linkedin: { type: String, default: "" },
	balance: { type: String, default: "0" },
	address: { type: String, default: "" },
	companyName: { type: String, default: "" },
	vat: { type: String, default: "" },
	country: { type: String, default: "" },
	state: { type: String, default: "" },
	zip: { type: String, default: "" },
	timezone: { type: String, default: "" },
	currency: { type: String, default: "" },
});

// User schema
const UserSchema = new Schema<IUser, UserModel>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: Object.values(Role), default: Role.USER },
		paymentDetails: { type: PaymentDetailsSchema },
		personalDetails: { type: PersonalDetailsSchema },
	},
	{ timestamps: true, versionKey: false }
);

UserSchema.statics.isUserExist = async function (
	email: string
): Promise<Pick<IUser, "_id" | "name" | "email" | "password" | "role"> | null> {
	return await User.findOne(
		{ email: email },
		{ _id: 1, name: 1, email: 1, password: 1, role: 1 }
	).lean();
};

UserSchema.statics.isPasswordMatch = async function (
	givenPassword: string,
	savedPassword: string
): Promise<boolean> {
	return await bcrypt.compare(givenPassword, savedPassword);
};

// hash password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	this.password = await bcrypt.hash(
		this.password,
		Number(config.bcrypt_salt_rounds)
	);
	if (!this.personalDetails) {
		this.personalDetails = {};
	}

	if (this.personalDetails.balance === undefined) {
		this.personalDetails.balance = "0";
	}
	next();
});

export const User = model<IUser, UserModel>("User", UserSchema);
