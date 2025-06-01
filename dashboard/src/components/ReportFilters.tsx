/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, subDays, subMonths, subWeeks, addMonths } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
	onFilterChange: (filterData: any) => void;
	searchFeeds: any[];
}

// Convert a JavaScript Date to Bangladesh Time (UTC+6)
const toBDTime = (date: Date) => {
	const bdOffset = 6 * 60; // in minutes
	const localOffset = date.getTimezoneOffset(); // in minutes
	return new Date(date.getTime() + (bdOffset + localOffset) * 60000);
};

export function ReportFilters({
	onFilterChange,
	searchFeeds,
}: ReportFiltersProps) {
	const today = toBDTime(new Date());

	const [filter, setFilter] = useState<string>("today");
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: today,
		to: addMonths(today, 1),
	});
	const [searchFeedId, setSearchFeedId] = useState<string>("");

	const updateFilterData = (updatedRange?: DateRange) => {
		onFilterChange({
			filter,
			startDate: updatedRange?.from || dateRange?.from,
			endDate: updatedRange?.to || dateRange?.to,
			searchFeedId,
		});
	};

	const handleFilterChange = (value: string) => {
		setFilter(value);
		let range: DateRange | undefined;

		switch (value) {
			case "today":
				range = { from: today, to: today };
				break;
			case "yesterday":
				range = {
					from: subDays(today, 1),
					to: subDays(today, 1),
				};
				break;
			case "this_week":
				range = {
					from: subDays(today, 7),
					to: today,
				};
				break;
			case "last_week":
				range = {
					from: subWeeks(today, 1),
					to: subDays(today, 7),
				};
				break;
			case "this_month":
				range = {
					from: subMonths(today, 1),
					to: today,
				};
				break;
			case "last_month":
				range = {
					from: subMonths(today, 2),
					to: subMonths(today, 1),
				};
				break;
			case "custom":
				range = dateRange;
				break;
			default:
				range = { from: today, to: today };
		}

		setDateRange(range);
		updateFilterData(range);
	};

	const handleDateChange = (range: DateRange | undefined) => {
		setDateRange(range);
		if (filter === "custom" && range?.from && range?.to) {
			updateFilterData(range);
		}
	};

	const handleSearchFeedChange = (value: string) => {
		const feedId = value === "all" ? "" : value;
		setSearchFeedId(feedId);
		onFilterChange({
			filter,
			startDate: dateRange?.from,
			endDate: dateRange?.to,
			searchFeedId: feedId,
		});
	};

	const handleApplyClick = () => {
		updateFilterData();
	};

	return (
		<div className="flex flex-wrap gap-4">
			<Select value={filter} onValueChange={handleFilterChange}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select filter" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="today">Today</SelectItem>
					<SelectItem value="yesterday">Yesterday</SelectItem>
					<SelectItem value="this_week">This Week</SelectItem>
					<SelectItem value="last_week">Last Week</SelectItem>
					<SelectItem value="this_month">This Month</SelectItem>
					<SelectItem value="last_month">Last Month</SelectItem>
					<SelectItem value="custom">Custom Range</SelectItem>
				</SelectContent>
			</Select>

			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						className={cn(
							"w-[240px] justify-start text-left font-normal",
							!dateRange && "text-muted-foreground"
						)}
						disabled={filter !== "custom"}
					>
						<CalendarDays className="mr-2 h-4 w-4" />
						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} -{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={dateRange?.from}
						selected={dateRange}
						onSelect={handleDateChange}
						numberOfMonths={2}
						disabled={filter !== "custom"}
					/>
				</PopoverContent>
			</Popover>

			{searchFeeds.length > 0 && (
				<Select
					value={searchFeedId}
					onValueChange={handleSearchFeedChange}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="All Search Feeds" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Search Feeds</SelectItem>
						{searchFeeds.map((feed) => (
							<SelectItem key={feed._id} value={feed._id}>
								{feed.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}

			{/* Filter button */}
			<Button onClick={handleApplyClick}>Apply Filter</Button>
		</div>
	);
}
