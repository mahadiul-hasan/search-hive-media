/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../ui/button";
import { ArrowUpDown } from "lucide-react";
import { ISearchFeedUser } from "@/types/searchFeed";
import { GetShortUrl } from "./GetShortUrl";

export const UserSearchFeedColumns: ColumnDef<ISearchFeedUser>[] = [
	{
		accessorKey: "_id",
		header: "Id",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("_id")}</div>
		),
	},
	{
		accessorKey: "user.name",
		header: "User",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.original.user.name}</div>
		),
	},
	{
		accessorKey: "name",
		header: "Feed Name",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "search_engine",
		header: "Search Engine",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("search_engine")}</div>
		),
	},
	{
		accessorKey: "search_cap",
		header: "Search Cap",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("search_cap")}</div>
		),
	},
	{
		accessorKey: "type_integration",
		header: "Integration Type",
		cell: ({ row }: any) => (
			<div className="text-center">
				{row.getValue("type_integration")}
			</div>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }: any) => (
			<div className="capitalize">
				<span
					className={`px-2 py-1 rounded-full text-xs ${
						row.getValue("status") === "active"
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{row.getValue("status")}
				</span>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }: any) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					CreatedAt
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }: any) => {
			const date = new Date(row.getValue("createdAt"));

			// Format the date
			const formattedDate = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short", // 'short' gives abbreviated month (e.g., Jan, Feb, Mar)
				day: "numeric",
			}).format(date);

			return <div>{formattedDate}</div>;
		},
	},
	{
		accessorKey: "short_url",
		header: () => <div className="text-right">Endpoint</div>,
		cell: ({ row }: any) => (
			<GetShortUrl shortUrl={row.getValue("short_url")} />
		),
	},
];
