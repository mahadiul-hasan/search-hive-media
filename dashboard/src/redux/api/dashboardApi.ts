import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const DASHBOARD_URL = "/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAdminStats: build.query({
			query: () => ({
				url: `${DASHBOARD_URL}/admin`,
				method: "GET",
			}),
			providesTags: [tagTypes.dashboard],
		}),
		getUserStats: build.query({
			query: () => ({
				url: `${DASHBOARD_URL}/user`,
				method: "GET",
			}),
			providesTags: [tagTypes.dashboard],
		}),
	}),
});

export const { useGetAdminStatsQuery, useGetUserStatsQuery } = dashboardApi;
