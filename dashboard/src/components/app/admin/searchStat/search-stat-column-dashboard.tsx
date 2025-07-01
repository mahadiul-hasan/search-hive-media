/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { ISearchStat } from "@/types/searchStat";

export const SearchStatColumnsDashboard: ColumnDef<ISearchStat>[] = [
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }: any) => (
			<div className="text-center">{row.original.date}</div>
		),
	},
	{
		accessorKey: "user.userId",
		header: "Account",
		cell: ({ row }: any) => (
			<div className="text-center">{row.original.user?.userId}</div>
		),
	},
	{
		accessorKey: "searchFeed.name",
		header: "Link Name",
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
];
