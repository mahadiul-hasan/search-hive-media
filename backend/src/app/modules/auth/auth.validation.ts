import { z } from "zod";

const loginZodSchema = z.object({
	body: z.object({
		email: z.string({
			required_error: "Email is required",
		}),
		password: z.string({
			required_error: "password is required",
		}),
	}),
});

const refreshTokenZodSchema = z.object({
	body: z.object({
		refreshToken: z.string({
			required_error: "Refresh Token is required",
		}),
	}),
});

const changePasswordZodSchema = z.object({
	body: z.object({
		oldPassword: z.string({
			required_error: "Old Password is required",
		}),
		newPassword: z.string({
			required_error: "New Password is required",
		}),
	}),
});

const forgotPasswordZodSchema = z.object({
	body: z.object({
		email: z.string({
			required_error: "Email is required",
		}),
	}),
});

const resetPasswordZodSchema = z.object({
	body: z.object({
		password: z.string({
			required_error: "New Password is required",
		}),
	}),
});

export const AuthValidation = {
	loginZodSchema,
	refreshTokenZodSchema,
	changePasswordZodSchema,
	forgotPasswordZodSchema,
	resetPasswordZodSchema,
};
