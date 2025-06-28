import { z } from "zod";

const create = z.object({
	body: z.object({
		feedId: z.string({
			required_error: "ID is required",
		}),
		name: z.string({
			required_error: "Name is required",
		}),
		search_cap: z.string({
			required_error: "Search cap is required",
		}),
		search_engine: z
			.enum(["google", "bing", "yahoo", "duckduckgo"])
			.optional(),
		status: z.enum(["active", "inactive"]).optional(),
		tid_level: z.string().optional(),
		type_integration: z.string().optional(),
		type_search: z.string().optional(),
		type_traffic: z.string().optional(),
		original_url: z.string().url(),
		countries: z.array(
			z.string({
				required_error: "Country is required",
			})
		),
		user: z.string({
			required_error: "User ID is required",
		}),
	}),
});

const update = z.object({
	body: z.object({
		feedId: z.string().optional(),
		name: z.string().optional(),
		search_cap: z.string().optional(),
		search_engine: z
			.enum(["google", "bing", "yahoo", "duckduckgo"])
			.optional(),
		status: z.enum(["active", "inactive"]).optional(),
		tid_level: z.string().optional(),
		type_integration: z.string().optional(),
		type_search: z.string().optional(),
		type_traffic: z.string().optional(),
		original_url: z.string().url(),
		countries: z.array(z.string().optional()),
		user: z.string().optional(),
	}),
});

export const SearchFeedValidation = {
	create,
	update,
};
