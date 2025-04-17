import express from "express";
import { RedirectController } from "./redirect.controller";

const router = express.Router();

router.get("/:shortUrl", RedirectController.handleShortUrlClick);

export default router;
