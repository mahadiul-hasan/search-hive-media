import { useGetAdminStatsQuery } from "@/redux/api/dashboardApi";

export default function AdminDashboard() {
	const { data } = useGetAdminStatsQuery({});
	const stat = data?.data || [];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
			<div className="card bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Total Users
				</h3>
				<p className="text-3xl">{stat.totalUsers}</p>
			</div>

			<div className="card bg-purple-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Total Feeds
				</h3>
				<p className="text-3xl">{stat.totalFeeds}</p>
			</div>

			<div className="card bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Total Clicks
				</h3>
				<p className="text-3xl">{stat.totalClicks}</p>
			</div>

			<div className="card bg-cyan-400 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Total Valid
				</h3>
				<p className="text-3xl">{stat.totalValid}</p>
			</div>
		</div>
	);
}
