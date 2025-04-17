import { model, Schema } from "mongoose";
import { ISearchStat, SearchStatModel } from "./searchStat.interface";

const SearchStatSchema = new Schema<ISearchStat, SearchStatModel>(
	{
		searches: { type: String, default: "0" },
		valid: { type: String, default: "0" },
		mistake: { type: String, default: "0" },
		monetized: { type: String, default: "0" },
		unique_ips: { type: String, default: "0" },
		visitors: { type: String, default: "0" },
		ctr: { type: String, default: "0" },
		coverage: { type: String, default: "0" },
		clicks: { type: String, default: "0" },
		epc: { type: String, default: "0" },
		rpm: { type: String, default: "0" },
		revenue: { type: String, default: "0" },

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
