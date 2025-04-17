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
import { IContact } from "@/types/contact";
import DeleteButton from "./DeleteButton";

export const ContactColumns: ColumnDef<IContact>[] = [
	{
		accessorKey: "_id",
		header: "Id",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("_id")}</div>
		),
	},
	{
		accessorKey: "firstName",
		header: "First Name",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("firstName")}</div>
		),
	},
	{
		accessorKey: "lastName",
		header: "Last Name",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("lastName")}</div>
		),
	},
	{
		accessorKey: "company",
		header: "Company",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("company")}</div>
		),
	},
	{
		accessorKey: "website",
		header: "Website",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("website")}</div>
		),
	},
	{
		accessorKey: "whatsApp",
		header: "WhatsApp",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("whatsApp")}</div>
		),
	},
	{
		accessorKey: "telegram",
		header: "Telegram",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("telegram")}</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }: any) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Email
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }: any) => (
			<div className="lowercase">{row.getValue("email")}</div>
		),
	},
	{
		accessorKey: "message",
		header: "Message",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("message")}</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Created At",
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
		id: "actions",
		header: "Actions",
		cell: ({ row }: any) => {
			const contact = row.original;

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
						<DropdownMenuItem className="cursor-pointer">
							<DeleteButton id={contact._id} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
