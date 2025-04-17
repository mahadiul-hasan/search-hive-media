import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { ContactValidation } from "./contact.validation";
import { ContactController } from "./contact.controller";

const router = express.Router();

router.post(
	"/create",
	validateRequest(ContactValidation.create),
	ContactController.createContact
);

router.delete("/:id", auth("admin"), ContactController.deleteContact);

router.get("/", auth("admin"), ContactController.getAllContacts);

export const ContactRoutes = router;
