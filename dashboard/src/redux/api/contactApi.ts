import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const CONTACT_URL = "/contacts";

export const contactApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		contacts: build.query({
			query: () => ({
				url: `${CONTACT_URL}`,
				method: "GET",
			}),
			providesTags: [tagTypes.contact],
		}),
		deleteContact: build.mutation({
			query: (id) => ({
				url: `${CONTACT_URL}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.contact],
		}),
	}),
});

export const { useContactsQuery, useDeleteContactMutation } = contactApi;
