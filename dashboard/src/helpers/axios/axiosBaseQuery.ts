/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig } from "axios";
import { instance as axiosInstance } from "./axiosInstance";
import { refreshToken } from "@/utils/refreshToken";

export const axiosBaseQuery =
	(
		{ baseUrl }: { baseUrl: string } = { baseUrl: "" }
	): BaseQueryFn<
		{
			url: string;
			method: AxiosRequestConfig["method"];
			data?: AxiosRequestConfig["data"];
			params?: AxiosRequestConfig["params"];
			contentType?: string;
		},
		unknown,
		unknown
	> =>
	async ({ url, method, data, params, contentType }) => {
		try {
			const accessToken = localStorage.getItem("accessToken");

			const result = await axiosInstance({
				url: baseUrl + url,
				method,
				data,
				params,
				headers: {
					"Content-Type": contentType || "application/json",
					Authorization: accessToken,
				},
				withCredentials: true,
			});

			return { data: result.data };
		} catch (error: any) {
			// If unauthorized, try to refresh the token
			if (error?.message === "jwt expired") {
				try {
					const newAccessToken = await refreshToken();

					// Retry original request
					const retryResult = await axiosInstance({
						url: baseUrl + url,
						method,
						data,
						params,
						headers: {
							"Content-Type": contentType || "application/json",
							Authorization: newAccessToken,
						},
						withCredentials: true,
					});

					return { data: retryResult.data };
				} catch {
					// 🚨 Refresh failed — logout user
					localStorage.removeItem("accessToken");
					window.location.href = "/login"; // ⬅️ redirect to login
					return {
						error: {
							status: 401,
							data: "Session expired. Please login again.",
						},
					};
				}
			}

			// Other errors
			return {
				error: {
					status: error.response?.status,
					data: error.response?.data || error.message,
				},
			};
		}
	};
