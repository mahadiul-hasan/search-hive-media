export type ILogin = {
	email: string;
	password: string;
};

export type IRefreshTokenResponse = {
	accessToken: string;
};

export type IChengePassword = {
	oldPassword: string;
	newPassword: string;
};
