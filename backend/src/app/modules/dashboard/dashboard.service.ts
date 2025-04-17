import dayjs from "dayjs";
import { Click } from "../click/click.model";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import { SearchStat } from "../searchStat/searchStat.model";
import { User } from "../user/user.model";
import { Types } from "mongoose";

const getAdminDashboardStat = async () => {
	const [totalUsers, totalFeeds, totalClicksAgg, totalValidAgg] =
		await Promise.all([
			User.countDocuments(),
			SearchFeed.countDocuments(),
			Click.aggregate([
				{ $group: { _id: null, total: { $sum: "$clicks" } } },
			]),
			SearchStat.aggregate([
				{
					$group: {
						_id: null,
						totalValid: {
							$sum: {
								$toInt: "$valid", // cast valid (string) to number
							},
						},
					},
				},
			]),
		]);

	return {
		totalUsers,
		totalFeeds,
		totalClicks: totalClicksAgg[0]?.total || 0,
		totalValid: totalValidAgg[0]?.totalValid || 0,
	};
};
const getUserDashboardStat = async (id: string) => {
	const today = dayjs().startOf("day").toDate();
	const yesterday = dayjs().subtract(1, "day").startOf("day").toDate();

	const [todayAgg, yesterdayAgg, user] = await Promise.all([
		SearchStat.aggregate([
			{
				$match: {
					user: new Types.ObjectId(id),
					createdAt: { $gte: today },
				},
			},
			{
				$group: {
					_id: null,
					revenue: { $sum: { $toDouble: "$revenue" } },
				},
			},
		]),
		SearchStat.aggregate([
			{
				$match: {
					user: new Types.ObjectId(id),
					createdAt: { $gte: yesterday, $lt: today },
				},
			},
			{
				$group: {
					_id: null,
					revenue: { $sum: { $toDouble: "$revenue" } },
				},
			},
		]),
		User.findById(id).select("personalDetails.balance").lean(),
	]);

	return {
		todayRevenue: todayAgg[0]?.revenue || 0,
		yesterdayRevenue: yesterdayAgg[0]?.revenue || 0,
		accountBalance: parseFloat(user?.personalDetails?.balance || "0"),
	};
};

export const DashboardService = {
	getAdminDashboardStat,
	getUserDashboardStat,
};
