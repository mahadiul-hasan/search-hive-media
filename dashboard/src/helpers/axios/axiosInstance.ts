import { IGenericErrorResponse } from "@/types/common";
import { getFromLocalStorage } from "@/utils/local-storage";
import axios from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Add a request interceptor
instance.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		const accessToken = getFromLocalStorage("accessToken");
		if (accessToken) {
			config.headers.Authorization = accessToken;
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		const responseObject: IGenericErrorResponse = {
			statusCode: error?.response?.data?.statusCode || 500,
			message: error?.response?.data?.message || "Something went wrong",
			errorMessages: error?.response?.data?.message,
		};

		return Promise.reject(responseObject);
	}
);

export { instance };
