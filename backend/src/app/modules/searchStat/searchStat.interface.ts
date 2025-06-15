import { Model, Types } from "mongoose";

export interface ISearchStat extends Document {
	_id: Types.ObjectId;
	searches: number;
	valid: number;
	mistake: number;
	monetized: number;
	unique_ips: number;
	visitors: number;
	ctr: number;
	coverage: number;
	clicks: number;
	epc: number;
	rpm: number;
	revenue: number;
	ip: string;
	os: string;
	browser: string;
	device: string;
	domain: string;
	keyword: string;
	searchFeed: Types.ObjectId;
	user: Types.ObjectId;
	createdAt: Date;
}

export type SearchStatModel = Model<ISearchStat, Record<string, unknown>>;

export type DateFilter =
	| "today"
	| "yesterday"
	| "this_week"
	| "last_week"
	| "this_month"
	| "last_month"
	| "custom";

export interface SearchStatFilters {
	dateFilter?: DateFilter;
	customRange?: {
		from: string; // ISO date string
		to: string; // ISO date string
	};
	searchFeedId?: string; // Mongo ObjectId as string
}
