import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/login", AuthController.login);

router.post(
	"/refresh-token",
	validateRequest(AuthValidation.refreshTokenZodSchema),
	AuthController.refreshToken
);

router.post(
	"/change-password",
	validateRequest(AuthValidation.changePasswordZodSchema),
	auth("admin", "user"),
	AuthController.changePassword
);

router.post("/logout", auth("admin", "user"), AuthController.logout);

export const AuthRoutes = router;
