/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserStatsQuery } from "@/redux/api/dashboardApi";
import { getUserInfo } from "@/services/auth.service";

export default function UserDashboard() {
	const { data } = useGetUserStatsQuery({});
	const stat = data?.data || [];

	const user = getUserInfo() as any;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
			<div className="card bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Today Revenue
				</h3>
				<p className="text-3xl">{stat.todayRevenue}</p>
			</div>

			<div className="card bg-purple-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Yesterday Revenue
				</h3>
				<p className="text-3xl">{stat.yesterdayRevenue}</p>
			</div>

			<div className="card bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">
					Account Balance
				</h3>
				<p className="text-3xl">{stat.accountBalance}</p>
			</div>

			<div className="card bg-cyan-400 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
				<h3 className="text-xl text-center font-bold mb-2">User</h3>
				<p className="text-3xl text-center">{user?.name}</p>
			</div>
		</div>
	);
}
