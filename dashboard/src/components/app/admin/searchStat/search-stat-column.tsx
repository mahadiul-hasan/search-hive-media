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
import { ISearchStat } from "@/types/searchStat";
import { Checkbox } from "@/components/ui/Checkbox";

export const SearchStatColumns: ColumnDef<ISearchStat>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value: any) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "_id",
		header: "ID",
		cell: ({ row }) => (
			<div className="text-center text-sm font-mono">
				{row.original.originalIds?.[0] || "N/A"}
			</div>
		),
	},
	{
		accessorKey: "user.name",
		header: "User",
		cell: ({ row }: any) => (
			<div className="text-center">{row.original.user?.name}</div>
		),
	},
	{
		accessorKey: "searchFeed.name",
		header: "Feed Name",
		cell: ({ row }: any) => (
			<div className="text-center">{row.original.searchFeed?.name}</div>
		),
	},
	{
		accessorKey: "searches",
		header: "Searches",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("searches")}</div>
		),
	},
	{
		accessorKey: "valid",
		header: "Valid",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("valid")}</div>
		),
	},
	{
		accessorKey: "mistake",
		header: "Errors",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("mistake")}</div>
		),
	},
	{
		accessorKey: "monetized",
		header: "Monetized",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("monetized")}</div>
		),
	},
	{
		accessorKey: "unique_ips",
		header: "Unique IPs",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("unique_ips")}</div>
		),
	},
	{
		accessorKey: "visitors",
		header: "Visitors",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("visitors")}</div>
		),
	},
	{
		accessorKey: "ctr",
		header: "CTR",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("ctr")}</div>
		),
	},
	{
		accessorKey: "coverage",
		header: "Coverage",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("coverage")}</div>
		),
	},
	{
		accessorKey: "clicks",
		header: "Clicks",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("clicks")}</div>
		),
	},
	{
		accessorKey: "epc",
		header: "EPC",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("epc")}</div>
		),
	},
	{
		accessorKey: "rpm",
		header: "RPM",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("rpm")}</div>
		),
	},
	{
		accessorKey: "revenue",
		header: "Revenue",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("revenue")}</div>
		),
	},
	{
		accessorKey: "ip",
		header: "IP",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("ip")}</div>
		),
	},
	{
		accessorKey: "os",
		header: "OS",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("os")}</div>
		),
	},
	{
		accessorKey: "browser",
		header: "Browser",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("browser")}</div>
		),
	},
	{
		accessorKey: "device",
		header: "Device",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("device")}</div>
		),
	},
	{
		accessorKey: "domain",
		header: "Domain",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("domain")}</div>
		),
	},
	{
		accessorKey: "keyword",
		header: "Keyword",
		cell: ({ row }: any) => (
			<div className="text-center">{row.getValue("keyword")}</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }: any) => (
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				Created At <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: any) => {
			const date = new Date(row.getValue("createdAt"));
			const formatted = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			}).format(date);
			return <div>{formatted}</div>;
		},
		filterFn: (row, columnId, filterValue: string) => {
			const rowDate = new Date(row.getValue(columnId));
			const selectedDate = new Date(filterValue);

			// Format using local date instead of UTC
			const formatDateLocal = (date: Date) =>
				`${date.getFullYear()}-${(date.getMonth() + 1)
					.toString()
					.padStart(2, "0")}-${date
					.getDate()
					.toString()
					.padStart(2, "0")}`;

			return formatDateLocal(rowDate) === formatDateLocal(selectedDate);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }: any) => {
			const stat = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>
							<Link to={`/admin/update-search-stat/${stat._id}`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<DeleteButton id={stat._id} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
