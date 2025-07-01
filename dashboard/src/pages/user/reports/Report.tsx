/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useMySearchStatQuery } from "@/redux/api/searchStatApi";
import Loader from "@/components/Loader";
import { useMySearchFeedQuery } from "@/redux/api/searchFeedApi";
import { SearchStatDataTable } from "@/components/app/admin/searchStat/search-stat-table";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { SearchStatColumnsDashboard } from "@/components/app/admin/searchStat/search-stat-column-dashboard";

type DateFilter =
	| "today"
	| "yesterday"
	| "this_week"
	| "last_week"
	| "this_month"
	| "last_month"
	| "custom";
type GroupBy = "hour" | "day" | "month";

interface Filters {
	dateFilter: DateFilter;
	from: string;
	to: string;
	searchFeedId: string;
	groupBy: GroupBy;
}

interface AppliedFilters {
	dateFilter: DateFilter;
	customRange?: { from: string; to: string };
	searchFeedId: string;
	groupBy: GroupBy;
}

const filterOptions = [
	{ value: "today" as const, label: "Today" },
	{ value: "yesterday" as const, label: "Yesterday" },
	{ value: "this_week" as const, label: "This Week" },
	{ value: "last_week" as const, label: "Last Week" },
	{ value: "this_month" as const, label: "This Month" },
	{ value: "last_month" as const, label: "Last Month" },
	{ value: "custom" as const, label: "Custom Range" },
];

const groupByOptions = [
	{ value: "hour" as const, label: "Hourly" },
	{ value: "day" as const, label: "Daily" },
	{ value: "month" as const, label: "Monthly" },
];

export default function Report() {
	const [filters, setFilters] = useState<Filters>({
		dateFilter: "today",
		from: "",
		to: "",
		searchFeedId: "",
		groupBy: "hour",
	});

	const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
		dateFilter: "today",
		searchFeedId: "",
		groupBy: "hour",
	});
	const [isApplyingFilters, setIsApplyingFilters] = useState(false);

	const [page, setPage] = useState(1);
	const limit = 10;

	// Fetch search feeds to populate dropdown
	const { data: searchFeedsData, isLoading: isLoadingFeeds } =
		useMySearchFeedQuery({});

	const [filtersDebounced] = useDebounce(appliedFilters, 500);

	const { data, isLoading, isFetching } = useMySearchStatQuery(
		filtersDebounced,
		{
			refetchOnMountOrArgChange: true,
		}
	);

	const stats = data?.data?.stats || [];
	const searchFeeds = searchFeedsData?.data || [];
	const total = data?.data.total || 0;
	const totalSearches = data?.data.totalSearches || 0;
	const totalRevenue = data?.data.totalRevenue || 0;

	const handleFilterChange = () => {
		const newAppliedFilters: AppliedFilters = {
			dateFilter: filters.dateFilter,
			searchFeedId: filters.searchFeedId,
			groupBy: filters.groupBy,
		};

		if (filters.dateFilter === "custom") {
			if (filters.from && filters.to) {
				newAppliedFilters.customRange = {
					from: filters.from,
					to: filters.to,
				};
			} else {
				alert(
					"Please select both 'From' and 'To' dates for custom range"
				);
				return;
			}
		}

		setAppliedFilters(newAppliedFilters);
		setPage(1);
		setIsApplyingFilters(true);
	};

	const handleResetFilters = () => {
		setFilters({
			dateFilter: "today",
			from: "",
			to: "",
			searchFeedId: "",
			groupBy: "hour",
		});
		setAppliedFilters({
			dateFilter: "today",
			searchFeedId: "",
			groupBy: "hour",
		});
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	useEffect(() => {
		if (!isFetching && isApplyingFilters) {
			setIsApplyingFilters(false);
		}
	}, [isFetching, isApplyingFilters]);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-4 items-end">
				{/* Group By Dropdown */}
				<div>
					<label className="block mb-1">Group By</label>
					<select
						className="border px-2 py-1 rounded"
						value={filters.groupBy}
						onChange={(e) =>
							setFilters({
								...filters,
								groupBy: e.target.value as GroupBy,
							})
						}
					>
						{groupByOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Date Filter Dropdown */}
				<div>
					<label className="block mb-1">Date Filter</label>
					<select
						className="border px-2 py-1 rounded"
						value={filters.dateFilter}
						onChange={(e) =>
							setFilters({
								...filters,
								dateFilter: e.target.value as DateFilter,
							})
						}
					>
						{filterOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Custom Range Fields */}
				{filters.dateFilter === "custom" && (
					<>
						<div>
							<label className="block mb-1">From</label>
							<input
								type="date"
								className="border px-2 py-1 rounded"
								value={filters.from}
								onChange={(e) =>
									setFilters({
										...filters,
										from: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block mb-1">To</label>
							<input
								type="date"
								className="border px-2 py-1 rounded"
								value={filters.to}
								onChange={(e) =>
									setFilters({
										...filters,
										to: e.target.value,
									})
								}
							/>
						</div>
					</>
				)}

				{/* Search Feed Dropdown */}
				<div>
					<label className="block mb-1">Search Feed</label>
					<select
						className="border px-2 py-1 rounded"
						value={filters.searchFeedId}
						onChange={(e) =>
							setFilters({
								...filters,
								searchFeedId: e.target.value,
							})
						}
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

				{/* Filter and Reset Buttons */}
				<div className="flex gap-2">
					<Button
						onClick={handleFilterChange}
						disabled={isApplyingFilters}
					>
						{isApplyingFilters ? (
							<span className="flex items-center gap-2">
								<Loader2 className="animate-spin w-4 h-4" />
								Applying...
							</span>
						) : (
							"Apply Filters"
						)}
					</Button>
					<Button variant="outline" onClick={handleResetFilters}>
						Reset
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-4 rounded shadow">
					<h3 className="text-sm font-medium text-gray-500">
						Total Searches
					</h3>
					<p className="text-2xl font-semibold">
						{totalSearches.toLocaleString()}
					</p>
				</div>
				<div className="bg-white p-4 rounded shadow">
					<h3 className="text-sm font-medium text-gray-500">
						Total Revenue
					</h3>
					<p className="text-2xl font-semibold">
						${totalRevenue.toLocaleString()}
					</p>
				</div>
				<div className="bg-white p-4 rounded shadow">
					<h3 className="text-sm font-medium text-gray-500">
						Records Found
					</h3>
					<p className="text-2xl font-semibold">
						{total.toLocaleString()}
					</p>
				</div>
			</div>

			{isLoading || isFetching ? (
				<Loader />
			) : (
				<>
					<SearchStatDataTable
						columns={SearchStatColumnsDashboard}
						data={stats}
					/>
					<CustomPagination
						currentPage={page}
						totalItems={total}
						itemsPerPage={limit}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	);
}
