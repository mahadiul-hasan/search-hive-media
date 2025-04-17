import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const CLICK_URL = "/clicks";

export const clickApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllShortUrl: build.query({
			query: () => ({
				url: `${CLICK_URL}`,
				method: "GET",
			}),
			providesTags: [tagTypes.shortUrl],
		}),
		getTotalClicks: build.query({
			query: (shortUrl) => ({
				url: `${CLICK_URL}/${shortUrl}/clicks`,
				method: "GET",
			}),
			providesTags: [tagTypes.click],
		}),
	}),
});

export const { useGetAllShortUrlQuery, useGetTotalClicksQuery } = clickApi;
