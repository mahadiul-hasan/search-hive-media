import { Model, Types } from "mongoose";

export interface IClick extends Document {
	searchFeedId: Types.ObjectId;
	date: string;
	clicks: number;
}

export type ClickModel = Model<IClick, Record<string, unknown>>;
