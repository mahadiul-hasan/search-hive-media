import { Model, Types } from "mongoose";

export interface ISearchStat extends Document {
	searches: string;
	valid: string;
	mistake: string;
	monetized: string;
	unique_ips: string;
	visitors: string;
	ctr: string;
	coverage: string;
	clicks: string;
	epc: string;
	rpm: string;
	revenue: string;
	ip: string;
	os: string;
	browser: string;
	device: string;
	domain: string;
	keyword: string;
	searchFeed: Types.ObjectId;
	user: Types.ObjectId;
}

export type SearchStatModel = Model<ISearchStat, Record<string, unknown>>;
