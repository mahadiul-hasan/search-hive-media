import { model, Schema } from "mongoose";
import { ClickModel, IClick } from "./click.interface";

const ClickSchema = new Schema<IClick, ClickModel>(
	{
		searchFeedId: {
			type: Schema.Types.ObjectId,
			ref: "SearchFeed",
			required: true,
		},
		date: {
			type: String, // Format: YYYY-MM-DD
			required: true,
		},
		clicks: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, versionKey: false }
);

ClickSchema.index({ searchFeedId: 1, date: 1 }, { unique: true });

export const Click = model<IClick, ClickModel>("Click", ClickSchema);
