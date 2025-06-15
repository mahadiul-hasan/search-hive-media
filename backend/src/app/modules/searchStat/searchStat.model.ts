import { model, Schema } from "mongoose";
import { ISearchStat, SearchStatModel } from "./searchStat.interface";

const SearchStatSchema = new Schema<ISearchStat, SearchStatModel>(
	{
		// Metrics fields
		searches: { type: Number, default: 0 },
		valid: { type: Number, default: 0 },
		mistake: { type: Number, default: 0 },
		monetized: { type: Number, default: 0 },
		unique_ips: { type: Number, default: 0 },
		visitors: { type: Number, default: 0 },
		ctr: { type: Number, default: 0 },
		coverage: { type: Number, default: 0 },
		clicks: { type: Number, default: 0 },
		epc: { type: Number, default: 0 },
		rpm: { type: Number, default: 0 },
		revenue: { type: Number, default: 0 },

		// Optional tracking fields
		ip: { type: String },
		os: { type: String },
		browser: { type: String },
		device: { type: String },
		domain: { type: String },
		keyword: { type: String },

		// Reference fields
		searchFeed: {
			type: Schema.Types.ObjectId,
			ref: "SearchFeed",
			required: true,
			index: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		autoIndex: true, // Ensure indexes are created
	}
);

// Compound indexes for optimized queries
SearchStatSchema.index(
	{
		searchFeed: 1,
		statType: 1,
		createdAt: 1,
	},
	{ name: "feed_stat_type_timestamp_idx" }
);

SearchStatSchema.index(
	{
		user: 1,
		createdAt: -1,
	},
	{ name: "user_timestamp_idx" }
);

// Index for time-range queries
SearchStatSchema.index(
	{
		createdAt: 1,
	},
	{
		name: "timestamp_idx",
		expireAfterSeconds: 86400 * 30, // Optional: Auto-delete after 30 days
	}
);

export const SearchStat = model<ISearchStat, SearchStatModel>(
	"SearchStat",
	SearchStatSchema
);
