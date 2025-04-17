import { baseApi } from "./baseApi";
const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		userLogin: build.mutation({
			query: (loginData) => ({
				url: `${AUTH_URL}/login`,
				method: "POST",
				data: loginData,
			}),
		}),
		changePassword: build.mutation({
			query: (data) => ({
				url: `${AUTH_URL}/change-password`,
				method: "POST",
				data: data,
			}),
		}),
		logout: build.mutation({
			query: () => ({
				url: `${AUTH_URL}/logout`,
				method: "POST",
			}),
		}),
	}),
});

export const {
	useUserLoginMutation,
	useChangePasswordMutation,
	useLogoutMutation,
} = authApi;
