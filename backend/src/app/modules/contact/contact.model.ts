import { model, Schema } from "mongoose";
import { ContactModel, IContact } from "./contact.interface";

const ContactSchema = new Schema<IContact, ContactModel>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		company: { type: String },
		website: { type: String },
		whatsApp: { type: String },
		telegram: { type: String },
		email: { type: String, required: true },
		message: { type: String },
	},
	{ timestamps: true, versionKey: false }
);

export const Contact = model<IContact, ContactModel>("Contact", ContactSchema);
