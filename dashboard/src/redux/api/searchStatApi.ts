/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchStatResponse } from "@/types/searchStat";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const SEARCH_STAT_URL = "/search-stats";

export const searchStatApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		searchStats: build.query<
			SearchStatResponse,
			{
				dateFilter?: string;
				customRange?: { from: string; to: string };
				searchFeedId?: string;
				groupBy?: "hour" | "day" | "month";
				page?: number;
				limit?: number;
			}
		>({
			query: (filters) => {
				// Clean the filters object to remove undefined values
				const params: Record<string, any> = {
					...filters,
					customRange: filters.customRange
						? JSON.stringify(filters.customRange)
						: undefined,
				};

				// Remove undefined parameters
				Object.keys(params).forEach(
					(key) => params[key] === undefined && delete params[key]
				);

				return {
					url: `${SEARCH_STAT_URL}`,
					method: "GET",
					params, // Pass the cleaned params
				};
			},
			providesTags: [tagTypes.searchStat],
		}),
		singleSearchStat: build.query({
			query: (id: string) => ({
				url: `${SEARCH_STAT_URL}/single/${id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.searchStat],
		}),
		mySearchStat: build.query({
			query: (filters: {
				dateFilter?: string;
				customRange?: { from: string; to: string };
				searchFeedId?: string;
			}) => ({
				url: `${SEARCH_STAT_URL}/my`,
				method: "GET",
				params: filters,
			}),
			providesTags: [tagTypes.searchStat],
		}),
		updateSearchStat: build.mutation({
			query: (data) => ({
				url: `${SEARCH_STAT_URL}/${data.id}`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.searchStat],
		}),
		deleteSearchStat: build.mutation({
			query: (id) => ({
				url: `${SEARCH_STAT_URL}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.searchStat],
		}),
	}),
});

export const {
	useSearchStatsQuery,
	useSingleSearchStatQuery,
	useMySearchStatQuery,
	useUpdateSearchStatMutation,
	useDeleteSearchStatMutation,
} = searchStatApi;
