import { Model, Types } from "mongoose";

export interface ISearchFeed extends Document {
	name: string;
	search_cap: string;
	search_engine?: "google" | "bing" | "yahoo" | "duckduckgo";
	status?: "active" | "inactive";
	tid_level?: string;
	type_integration?: string;
	type_search?: string;
	type_traffic?: string;
	original_url: string;
	short_url: string;
	countries: [string];
	user: Types.ObjectId;
}

export type SearchFeedModel = Model<ISearchFeed, Record<string, unknown>>;
