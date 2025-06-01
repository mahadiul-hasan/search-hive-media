import { z } from "zod";

const update = z.object({
	body: z.object({
		searches: z.number().optional(),
		valid: z.number().optional(),
		mistake: z.number().optional(),
		monetized: z.number().optional(),
		unique_ips: z.number().optional(),
		visitors: z.number().optional(),
		ctr: z.number().optional(),
		coverage: z.number().optional(),
		clicks: z.number().optional(),
		epc: z.number().optional(),
		rpm: z.number().optional(),
		revenue: z.number().optional(),

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
	update,
};
