import express from "express";
import auth from "../../middleware/auth";
import { ClickController } from "./click.controller";

const router = express.Router();

// Route to get total clicks and details for a short URL
router.get("/:shortUrl/clicks", auth("admin"), ClickController.getTotalClicks);

router.get("/", auth("admin"), ClickController.getAllShortUrl);

export const ClickRoutes = router;
