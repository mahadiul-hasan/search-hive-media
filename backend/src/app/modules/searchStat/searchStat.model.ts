import { model, Schema } from "mongoose";
import { ISearchStat, SearchStatModel } from "./searchStat.interface";

const SearchStatSchema = new Schema<ISearchStat, SearchStatModel>(
	{
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

		// Optional fields
		ip: { type: String, required: false },
		os: { type: String, required: false },
		browser: { type: String, required: false },
		device: { type: String, required: false },
		domain: { type: String, required: false },
		keyword: { type: String, required: false },

		// Reference to SearchFeed
		searchFeed: {
			type: Schema.Types.ObjectId,
			ref: "SearchFeed",
		},
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true, versionKey: false }
);

export const SearchStat = model<ISearchStat, SearchStatModel>(
	"SearchStat",
	SearchStatSchema
);
