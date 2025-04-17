import axios from "axios";

export const refreshToken = async () => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
			{},
			{
				withCredentials: true, // 🔥 this sends the cookie
			}
		);
		const { accessToken } = response.data.data;

		// Save new access token
		localStorage.setItem("accessToken", accessToken);

		return accessToken;
	} catch (error) {
		console.error("Refresh token failed", error);
		throw error;
	}
};
