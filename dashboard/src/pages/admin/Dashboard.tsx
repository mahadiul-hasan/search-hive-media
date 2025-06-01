import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { useGetAdminStatsQuery } from "@/redux/api/dashboardApi";

export default function AdminDashboard() {
	const { data } = useGetAdminStatsQuery({});
	const stat = data?.data || {};

	const cards = [
		{ label: "Total Users", value: stat.totalUsers, bg: "bg-green-500" },
		{ label: "Total Feeds", value: stat.totalFeeds, bg: "bg-purple-500" },
		{
			label: "Total Clicks",
			value: stat.totalClicksAgg,
			bg: "bg-blue-500",
		},
		{ label: "Total Valid", value: stat.totalValidAgg, bg: "bg-cyan-500" },
		{ label: "Today Clicks", value: stat.todayClicks, bg: "bg-orange-500" },
		{
			label: "Yesterday Clicks",
			value: stat.yesterdayClicks,
			bg: "bg-rose-500",
		},
	];

	return (
		<div className="space-y-10 mt-6">
			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{cards.map((card, index) => (
					<div
						key={index}
						className={`card ${card.bg} text-white p-6 rounded-lg shadow-lg flex flex-col items-center`}
					>
						<h3 className="text-xl text-center font-bold mb-2">
							{card.label}
						</h3>
						<p className="text-3xl">{card.value}</p>
					</div>
				))}
			</div>

			{/* Chart */}
			<div className="bg-white rounded-lg shadow-lg p-6">
				<h2 className="text-2xl font-bold mb-4">
					Daily Clicks & Valid Data
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart
						data={stat.dailyChartData || []}
						margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="_id" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type="monotone"
							dataKey="clicks"
							stroke="#8884d8"
							name="Clicks"
						/>
						<Line
							type="monotone"
							dataKey="valid"
							stroke="#82ca9d"
							name="Valid"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
