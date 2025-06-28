/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import DeleteButton from "./DeleteButton";
import { Link } from "react-router";
import { ISearchFeed } from "@/types/searchFeed";
import { GetShortUrl } from "../../user/searchFeed/GetShortUrl";

export const SearchFeedColumns: ColumnDef<ISearchFeed>[] = [
	{
		accessorKey: "user.id",
		header: "Account",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.original.user.id}</div>
		),
	},
	{
		accessorKey: "feedId",
		header: "Feed Id",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("feedId")}</div>
		),
	},
	{
		accessorKey: "name",
		header: "Name",
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
		accessorKey: "type_search",
		header: "Search Type",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("type_search")}</div>
		),
	},
	{
		accessorKey: "type_traffic",
		header: "Traffic Type",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("type_traffic")}</div>
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
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }: any) => {
			const searchFeed = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>
							<Link
								to={`/admin/update-search-feed/${searchFeed._id}`}
							>
								Edit Search Feed
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<DeleteButton id={searchFeed._id} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
