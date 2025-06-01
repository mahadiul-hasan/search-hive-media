import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.MONGO_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	email: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASS,
	jwt: {
		secret: process.env.JWT_SECRET,
		reset_secret: process.env.RESET_SECRET,
		expires_in: process.env.JWT_EXPIRES_IN,
		refresh_secret: process.env.JWT_REFRESH_SECRET,
		refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
	},
};
