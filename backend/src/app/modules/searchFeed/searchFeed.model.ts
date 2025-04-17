import { model, Schema } from "mongoose";
import { ISearchFeed, SearchFeedModel } from "./searchFeed.interface";

const SearchFeedSchema = new Schema<ISearchFeed, SearchFeedModel>(
	{
		name: { type: String, required: true },
		search_cap: { type: String, required: true },
		search_engine: {
			type: String,
			enum: ["google", "bing", "yahoo", "duckduckgo"],
			default: "google",
		},
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
		},
		tid_level: String,
		type_integration: String,
		type_search: String,
		type_traffic: String,
		original_url: { type: String, required: true },
		short_url: { type: String, required: true, unique: true },
		user: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true, versionKey: false }
);

export const SearchFeed = model<ISearchFeed, SearchFeedModel>(
	"SearchFeed",
	SearchFeedSchema
);
