import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";
import { sanitizeObject } from "../../shared/sanitizeInput";

export const validateRequest =
	(schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Sanitize body, query, params, cookies before validation
			req.body = sanitizeObject(req.body);
			req.query = sanitizeObject(req.query);
			req.params = sanitizeObject(req.params);
			req.cookies = sanitizeObject(req.cookies);

			// Run schema validation after sanitization
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
				cookies: req.cookies,
			});
			return next();
		} catch (error) {
			next(error);
		}
	};
