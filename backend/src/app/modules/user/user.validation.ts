import { z } from "zod";

const register = z.object({
	body: z.object({
		id: z.string({ required_error: "ID is required" }).min(1).max(50),
		name: z.string({ required_error: "Name is required" }).min(1).max(50),
		email: z.string({ required_error: "Email is required" }).email(),
		password: z.string().min(6, {
			message: "Password must be at least 6 characters long",
		}),
	}),
});

const update = z.object({
	body: z.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().email().optional(),
		role: z.enum(["admin", "user"]).optional(),
		personalDetails: z
			.object({
				phone: z.string().optional(),
				skype: z.string().optional(),
				telegram: z.string().optional(),
				linkedin: z.string().optional(),
				balance: z.string().optional(),
				address: z.string().optional(),
				companyName: z.string().optional(),
				vat: z.string().optional(),
				country: z.string().optional(),
				state: z.string().optional(),
				zip: z.string().optional(),
				timezone: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		paymentDetails: z
			.object({
				method: z.string().optional(),
				account: z.string().optional(),
			})
			.optional(),
	}),
});

export const UserValidation = {
	register,
	update,
};
