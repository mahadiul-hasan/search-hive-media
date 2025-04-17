import { z } from "zod";

const create = z.object({
	body: z.object({
		firstName: z
			.string({ required_error: "First Name is required" })
			.min(1)
			.max(50),
		lastName: z
			.string({ required_error: "Last Name is required" })
			.min(1)
			.max(50),
		company: z.string().optional(),
		website: z.string().optional(),
		whatsApp: z.string().optional(),
		telegram: z.string().optional(),
		email: z.string({ required_error: "Email is required" }).email(),
		message: z.string().optional(),
	}),
});

export const ContactValidation = {
	create,
};
