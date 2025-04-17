import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const SEARCH_STAT_URL = "/search-stats";

export const searchStatApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		searchStats: build.query({
			query: () => ({
				url: `${SEARCH_STAT_URL}`,
				method: "GET",
			}),
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
			query: () => ({
				url: `${SEARCH_STAT_URL}/my`,
				method: "GET",
			}),
			providesTags: [tagTypes.searchStat],
		}),
		createSearchStat: build.mutation({
			query: (data) => ({
				url: `${SEARCH_STAT_URL}/create`,
				method: "POST",
				data: data,
			}),
			invalidatesTags: [tagTypes.searchStat],
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
	useCreateSearchStatMutation,
	useUpdateSearchStatMutation,
	useDeleteSearchStatMutation,
} = searchStatApi;
