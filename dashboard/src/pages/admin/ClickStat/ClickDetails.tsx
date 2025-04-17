import ClickFilter from "@/components/app/admin/click/ClickFilter";
import Loader from "@/components/Loader";
import { useGetTotalClicksQuery } from "@/redux/api/clickApi";
import { useParams } from "react-router";

export default function ClickDetails() {
	const params = useParams();
	const shortUrl = params.shortUrl;
	const { data, isLoading } = useGetTotalClicksQuery(shortUrl);
	const details = data?.data || [];

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="p-4 max-w-6xl mx-auto">
						<h2 className="text-2xl text-center font-bold mb-8">
							Click Statistics For:{" "}
							<span className="text-amber-700">
								{details.shortUrl}
							</span>
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							<div className="card bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
								<h3 className="text-xl text-center font-bold mb-2">
									Today's Clicks
								</h3>
								<p className="text-3xl">
									{details.clicksToday}
								</p>
							</div>

							<div className="card bg-purple-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
								<h3 className="text-xl text-center font-bold mb-2">
									Yesterday's Clicks
								</h3>
								<p className="text-3xl">
									{details.clicksYesterday}
								</p>
							</div>

							<div className="card bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
								<h3 className="text-xl text-center font-bold mb-2">
									Total Clicks
								</h3>
								<p className="text-3xl">
									{details.totalClicks}
								</p>
							</div>
						</div>
					</div>
					<div className="mt-8">
						<ClickFilter allClicks={details.allClicks} />
					</div>
				</>
			)}
		</>
	);
}
