import { Model } from "mongoose";

export interface IContact extends Document {
	firstName: string;
	lastName: string;
	company?: string;
	website?: string;
	whatsApp?: string;
	telegram?: string;
	email: string;
	message?: string;
}

export type ContactModel = Model<IContact, Record<string, unknown>>;
