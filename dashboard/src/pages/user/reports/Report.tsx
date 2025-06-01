/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMySearchStatQuery } from "@/redux/api/searchStatApi";
import { ReportDataTable } from "@/components/app/user/reports/report-table";
import { ReportColumns } from "@/components/app/user/reports/report-column";
import Loader from "@/components/Loader";
import { useMySearchFeedQuery } from "@/redux/api/searchFeedApi";

const filterOptions = [
	"today",
	"yesterday",
	"this_week",
	"last_week",
	"this_month",
	"last_month",
	"custom",
];

export default function Report() {
	const [dateFilter, setDateFilter] = useState("today");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [searchFeedId, setSearchFeedId] = useState("");

	// Fetch search feeds to populate dropdown
	const { data: searchFeedsData, isLoading: isLoadingFeeds } =
		useMySearchFeedQuery({});

	// Fetch search stats with filters
	const { data, isLoading, isFetching } = useMySearchStatQuery({
		dateFilter,
		...(dateFilter === "custom" && from && to
			? { customRange: { from, to } }
			: {}),
		...(searchFeedId ? { searchFeedId } : {}),
	});

	const reports = data?.data || [];
	const searchFeeds = searchFeedsData?.data || [];

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-4 items-end">
				{/* Date Filter Dropdown */}
				<div>
					<label className="block mb-1">Date Filter</label>
					<select
						className="border px-2 py-1 rounded"
						value={dateFilter}
						onChange={(e) => setDateFilter(e.target.value)}
					>
						{filterOptions.map((option) => (
							<option key={option} value={option}>
								{option.replace("_", " ")}
							</option>
						))}
					</select>
				</div>

				{/* Custom Range Fields (only show if custom is selected) */}
				{dateFilter === "custom" && (
					<>
						<div>
							<label className="block mb-1">From</label>
							<input
								type="date"
								className="border px-2 py-1 rounded"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
							/>
						</div>
						<div>
							<label className="block mb-1">To</label>
							<input
								type="date"
								className="border px-2 py-1 rounded"
								value={to}
								onChange={(e) => setTo(e.target.value)}
							/>
						</div>
					</>
				)}

				{/* Search Feed Dropdown */}
				<div>
					<label className="block mb-1">Search Feed</label>
					<select
						className="border px-2 py-1 rounded"
						value={searchFeedId}
						onChange={(e) => setSearchFeedId(e.target.value)}
					>
						<option value="">All Feeds</option>
						{isLoadingFeeds ? (
							<option disabled>Loading feeds...</option>
						) : (
							searchFeeds.map((feed: any) => (
								<option key={feed._id} value={feed._id}>
									{feed.name}
								</option>
							))
						)}
					</select>
				</div>
			</div>

			{isLoading || isFetching ? (
				<Loader />
			) : (
				<ReportDataTable columns={ReportColumns} data={reports} />
			)}
		</div>
	);
}
