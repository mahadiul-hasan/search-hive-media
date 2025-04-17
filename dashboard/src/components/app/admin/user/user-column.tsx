/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/types/user";
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

export const UserColumns: ColumnDef<IUser>[] = [
	{
		accessorKey: "_id",
		header: "Id",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("_id")}</div>
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
		accessorKey: "role",
		header: "Role",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("role")}</div>
		),
	},
	{
		accessorKey: "balance",
		header: () => <div className="text-center">Balance</div>,
		cell: ({ row }: any) => {
			const user = row.original;
			const balance = user.personalDetails.balance;
			const currency = user.personalDetails.currency;

			return (
				<div className="text-center font-medium">
					{currency}-{balance}
				</div>
			);
		},
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
			const user = row.original;

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
							<Link to={`/admin/update-user/${user._id}`}>
								Edit User
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<DeleteButton id={user._id} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
