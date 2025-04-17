/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { IShortUrl } from "@/types/shortUrl";

export const ClickColumns: ColumnDef<IShortUrl>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "short_url",
		header: "Short Url",
		cell: ({ row }: any) => (
			<div className="capitalize">{row.getValue("short_url")}</div>
		),
	},
	{
		id: "actions",
		header: () => <div className="text-right">Action</div>,
		cell: ({ row }: any) => {
			const click = row.original;

			return (
				<div className="flex justify-end">
					<Link
						className="hover:underline text-blue-500"
						to={`/admin/click-stats/${click.short_url}`}
					>
						View Details
					</Link>
				</div>
			);
		},
	},
];
