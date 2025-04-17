import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const USER_URL = "/users";

export const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		users: build.query({
			query: () => ({
				url: `${USER_URL}`,
				method: "GET",
			}),
			providesTags: [tagTypes.user],
		}),
		singleUser: build.query({
			query: (id: string) => ({
				url: `${USER_URL}/single/${id}`,
				method: "GET",
			}),
			providesTags: [tagTypes.user],
		}),
		me: build.query({
			query: () => ({
				url: `${USER_URL}/me`,
				method: "GET",
			}),
			providesTags: [tagTypes.user],
		}),
		createUser: build.mutation({
			query: (data) => ({
				url: `${USER_URL}/register`,
				method: "POST",
				data: data,
			}),
			invalidatesTags: [tagTypes.user],
		}),
		updateUser: build.mutation({
			query: (data) => ({
				url: `${USER_URL}/update/${data.id}`,
				method: "PATCH",
				data: data.body,
			}),
			invalidatesTags: [tagTypes.user],
		}),
		updateUserOwn: build.mutation({
			query: (data) => ({
				url: `${USER_URL}/profile/update`,
				method: "PATCH",
				data: data,
			}),
			invalidatesTags: [tagTypes.user],
		}),
		deleteUser: build.mutation({
			query: (id) => ({
				url: `${USER_URL}/delete/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: [tagTypes.user],
		}),
	}),
});

export const {
	useUsersQuery,
	useSingleUserQuery,
	useMeQuery,
	useCreateUserMutation,
	useDeleteUserMutation,
	useUpdateUserMutation,
	useUpdateUserOwnMutation,
} = userApi;
