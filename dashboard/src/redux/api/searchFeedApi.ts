import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const SEARCH_FEED_URL = "/search-feeds";

export const searchFeedApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		searchFeeds: build.query({
			query: () => ({
				url: `${SEARCH_FEED_URL}`,
				method: "GET",
			}),
			providesTags: [tagTypes.searchFeed],
		}),
		singleSearchFeed: build.query({
			query: (id: string) => ({
				url: `${SEARCH_FEED_URL}/single/${id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.searchFeed],
		}),
		mySearchFeed: build.query({
			query: () => ({
				url: `${SEARCH_FEED_URL}/my`,
				method: "GET",
			}),
			providesTags: [tagTypes.searchFeed],
		}),
		createSearchFeed: build.mutation({
			query: (data) => ({
				url: `${SEARCH_FEED_URL}/create`,
				method: "POST",
				data: data,
			}),
			invalidatesTags: [tagTypes.searchFeed],
		}),
		updateSearchFeed: build.mutation({
			query: (data) => ({
				url: `${SEARCH_FEED_URL}/${data.id}`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.searchFeed],
		}),
		deleteSearchFeed: build.mutation({
			query: (id) => ({
				url: `${SEARCH_FEED_URL}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.searchFeed],
		}),
	}),
});

export const {
	useSearchFeedsQuery,
	useSingleSearchFeedQuery,
	useMySearchFeedQuery,
	useCreateSearchFeedMutation,
	useUpdateSearchFeedMutation,
	useDeleteSearchFeedMutation,
} = searchFeedApi;
