import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ContactRoutes } from "../modules/contact/contact.route";
import { SearchFeedRoutes } from "../modules/searchFeed/searchFeed.route";
import { SearchStatRoutes } from "../modules/searchStat/searchStat.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";

const router = express.Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: AuthRoutes,
	},
	{
		path: "/users",
		route: UserRoutes,
	},
	{
		path: "/search-feeds",
		route: SearchFeedRoutes,
	},
	{
		path: "/search-stats",
		route: SearchStatRoutes,
	},
	{
		path: "/dashboard",
		route: DashboardRoutes,
	},
	{
		path: "/contacts",
		route: ContactRoutes,
	},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
