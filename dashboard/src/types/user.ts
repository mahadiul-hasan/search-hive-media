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
		balance?: number;
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
