import { z } from "zod";

const create = z.object({
	body: z.object({
		searches: z.string().optional(),
		valid: z.string().optional(),
		mistake: z.string().optional(),
		monetized: z.string().optional(),
		unique_ips: z.string().optional(),
		visitors: z.string().optional(),
		ctr: z.string().optional(),
		coverage: z.string().optional(),
		clicks: z.string().optional(),
		epc: z.string().optional(),
		rpm: z.string().optional(),
		revenue: z.string().optional(),

		ip: z.string().optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
		device: z.string().optional(),
		domain: z.string().optional(),
		keyword: z.string().optional(),
		searchFeed: z.string({
			required_error: "User ID is required",
		}),
	}),
});

const update = z.object({
	body: z.object({
		searches: z.string().optional(),
		valid: z.string().optional(),
		mistake: z.string().optional(),
		monetized: z.string().optional(),
		unique_ips: z.string().optional(),
		visitors: z.string().optional(),
		ctr: z.string().optional(),
		coverage: z.string().optional(),
		clicks: z.string().optional(),
		epc: z.string().optional(),
		rpm: z.string().optional(),
		revenue: z.string().optional(),

		ip: z.string().optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
		device: z.string().optional(),
		domain: z.string().optional(),
		keyword: z.string().optional(),
		searchFeed: z.string().optional(),
		user: z.string().optional(),
	}),
});

export const SearchStatValidation = {
	create,
	update,
};
