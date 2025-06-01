import { LayoutDashboard, UsersIcon, SearchIcon } from "lucide-react";

export const navbarLinks = [
	{
		roles: ["admin", "user"],
		links: [
			{
				label: "Dashboard",
				path: "/admin/dashboard",
				icon: LayoutDashboard,
				roles: ["admin"],
			},
			{
				label: "Dashboard",
				path: "/user/dashboard",
				icon: LayoutDashboard,
				roles: ["user"],
			},
		],
	},
	{
		roles: ["admin", "user"],
		links: [
			{
				label: "Search Feeds",
				path: "/admin/search-feeds",
				icon: SearchIcon,
				roles: ["admin"],
			},
			{
				label: "Search Feed",
				path: "/user/search-feed",
				icon: SearchIcon,
				roles: ["user"],
			},
		],
	},
	{
		roles: ["admin"],
		links: [
			{
				label: "Search Stats",
				path: "/admin/search-stats",
				icon: SearchIcon,
				roles: ["admin"],
			},
		],
	},
	{
		roles: ["user"],
		links: [
			{
				label: "Reports",
				path: "/user/reports",
				icon: SearchIcon,
				roles: ["user"],
			},
		],
	},
	{
		roles: ["admin"],
		links: [
			{
				label: "User Management",
				path: "/admin/users",
				icon: UsersIcon,
				roles: ["admin"],
			},
		],
	},
	{
		roles: ["admin"],
		links: [
			{
				label: "Contact Management",
				path: "/admin/contacts",
				icon: UsersIcon,
				roles: ["admin"],
			},
		],
	},
];
