import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
	"/register",
	validateRequest(UserValidation.register),
	// auth("admin"),
	UserController.createUser
);

router.patch(
	"/profile/update",
	auth(),
	validateRequest(UserValidation.update),
	UserController.updateOwnProfile
);

router.patch(
	"/update/:id",
	auth("admin"),
	validateRequest(UserValidation.update),
	UserController.updateUserByAdmin
);
router.delete("/delete/:id", auth("admin"), UserController.deleteUser);

router.get("/single/:id", auth("admin", "user"), UserController.getUserById);

router.get("/", auth("admin"), UserController.getAllUsers);
router.get("/me", auth(), UserController.getOwnProfile);

export const UserRoutes = router;
