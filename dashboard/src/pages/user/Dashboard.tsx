/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserStatsQuery } from "@/redux/api/dashboardApi";
import { getUserInfo } from "@/services/auth.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	CartesianGrid,
} from "recharts";

export default function UserDashboard() {
	const { data, isLoading } = useGetUserStatsQuery({});
	const stat = data?.data;
	const user = getUserInfo() as any;

	const metrics = [
		{
			title: "Today Revenue",
			value: stat?.todayRevenue,
			color: "bg-green-500",
		},
		{
			title: "Yesterday Revenue",
			value: stat?.yesterdayRevenue,
			color: "bg-purple-500",
		},
		{
			title: "Account Balance",
			value: stat?.accountBalance,
			color: "bg-blue-500",
		},
		{
			title: "Today Clicks",
			value: stat?.todayClicks,
			color: "bg-orange-500",
		},
		{
			title: "Today Valid",
			value: stat?.todayValid,
			color: "bg-pink-500",
		},
		{
			title: "User",
			value: user?.name || "N/A",
			color: "bg-cyan-500",
		},
	];

	return (
		<div className="space-y-8 mt-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{isLoading
					? Array.from({ length: 6 }).map((_, i) => (
							<Skeleton key={i} className="h-32 rounded-xl" />
					  ))
					: metrics.map((item, index) => (
							<Card
								key={index}
								className={`${item.color} text-white`}
							>
								<CardContent className="flex flex-col items-center justify-center h-32 p-6">
									<h3 className="text-lg font-semibold mb-2 text-center">
										{item.title}
									</h3>
									<p className="text-3xl font-bold text-center">
										{item.value}
									</p>
								</CardContent>
							</Card>
					  ))}
			</div>

			{/* Chart */}
			<Card>
				<CardContent className="p-6">
					<h2 className="text-xl font-semibold mb-4">
						Daily Chart Overview
					</h2>
					{stat?.dailyChartData?.length > 0 ? (
						<div className="w-full h-72">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={stat.dailyChartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="_id" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="revenue"
										stroke="#16a34a"
										name="Revenue"
									/>
									<Line
										type="monotone"
										dataKey="clicks"
										stroke="#3b82f6"
										name="Clicks"
									/>
									<Line
										type="monotone"
										dataKey="valid"
										stroke="#ec4899"
										name="Valid"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					) : (
						<p>No chart data available.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
