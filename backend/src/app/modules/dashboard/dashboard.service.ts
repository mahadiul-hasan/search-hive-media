import dayjs from "dayjs";
import { SearchFeed } from "../searchFeed/searchFeed.model";
import { SearchStat } from "../searchStat/searchStat.model";
import { User } from "../user/user.model";
import { Types } from "mongoose";

const getAdminDashboardStat = async () => {
	const [totalUsers, totalFeeds] = await Promise.all([
		User.countDocuments(),
		SearchFeed.countDocuments(),
	]);

	const aggregation = await SearchStat.aggregate([
		{
			$group: {
				_id: null,
				totalClicksAgg: { $sum: { $toInt: "$searches" } },
				totalValidAgg: { $sum: { $toInt: "$valid" } },
			},
		},
	]);

	// Today and Yesterday ranges
	const todayStart = dayjs().startOf("day").toDate();
	const todayEnd = dayjs().endOf("day").toDate();
	const yesterdayStart = dayjs().subtract(1, "day").startOf("day").toDate();
	const yesterdayEnd = dayjs().subtract(1, "day").endOf("day").toDate();

	const [todayStats, yesterdayStats] = await Promise.all([
		SearchStat.aggregate([
			{
				$match: {
					createdAt: { $gte: todayStart, $lte: todayEnd },
				},
			},
			{
				$group: {
					_id: null,
					clicks: { $sum: { $toInt: "$searches" } },
				},
			},
		]),
		SearchStat.aggregate([
			{
				$match: {
					createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
				},
			},
			{
				$group: {
					_id: null,
					clicks: { $sum: { $toInt: "$searches" } },
				},
			},
		]),
	]);

	// 📊 Last 7 days for chart
	const sevenDaysAgo = dayjs().subtract(6, "day").startOf("day").toDate();

	const dailyChartData = await SearchStat.aggregate([
		{
			$match: {
				createdAt: { $gte: sevenDaysAgo },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
				},
				clicks: { $sum: { $toInt: "$searches" } },
				valid: { $sum: { $toInt: "$valid" } },
			},
		},
		{ $sort: { _id: 1 } },
	]);

	const result = {
		totalUsers,
		totalFeeds,
		totalClicksAgg: aggregation[0]?.totalClicksAgg || 0,
		totalValidAgg: aggregation[0]?.totalValidAgg || 0,
		todayClicks: todayStats[0]?.clicks || 0,
		yesterdayClicks: yesterdayStats[0]?.clicks || 0,
		dailyChartData,
	};

	return result;
};

const getUserDashboardStat = async (id: string) => {
	const today = dayjs().startOf("day").toDate();
	const yesterday = dayjs().subtract(1, "day").startOf("day").toDate();
	const sevenDaysAgo = dayjs().subtract(6, "day").startOf("day").toDate();

	const [todayAgg, yesterdayAgg, user, dailyChartData] = await Promise.all([
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
					clicks: { $sum: { $toInt: "$searches" } },
					valid: { $sum: { $toInt: "$valid" } },
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
		SearchStat.aggregate([
			{
				$match: {
					user: new Types.ObjectId(id),
					createdAt: { $gte: sevenDaysAgo },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$createdAt",
						},
					},
					revenue: { $sum: { $toDouble: "$revenue" } },
					clicks: { $sum: { $toInt: "$searches" } },
					valid: { $sum: { $toInt: "$valid" } },
				},
			},
			{ $sort: { _id: 1 } },
		]),
	]);

	return {
		todayRevenue: todayAgg[0]?.revenue || 0,
		todayClicks: todayAgg[0]?.clicks || 0,
		todayValid: todayAgg[0]?.valid || 0,
		yesterdayRevenue: yesterdayAgg[0]?.revenue || 0,
		accountBalance: parseFloat(user?.personalDetails?.balance || "0"),
		dailyChartData, // array of 7 days revenue/click/valid
	};
};

export const DashboardService = {
	getAdminDashboardStat,
	getUserDashboardStat,
};
