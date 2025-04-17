import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const redirectApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		redirect: build.query({
			query: (shortUrl) => ({
				url: `/${shortUrl}`,
				method: "GET",
			}),
			providesTags: [tagTypes.redirect],
		}),
	}),
});

export const { useRedirectQuery } = redirectApi;
