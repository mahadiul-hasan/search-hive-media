import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { SearchFeedValidation } from "./searchFeed.validation";
import { SearchFeedController } from "./searchFeed.controller";

const router = express.Router();

router.post(
	"/create",
	validateRequest(SearchFeedValidation.create),
	auth("admin"),
	SearchFeedController.createSearchFeed
);

router.patch(
	"/:id",
	validateRequest(SearchFeedValidation.update),
	auth("admin"),
	SearchFeedController.updateSearchFeed
);

router.delete("/:id", auth("admin"), SearchFeedController.deleteSearchFeed);

router.get(
	"/single/:id",
	auth("admin"),
	SearchFeedController.getSingleSearchFeed
);

router.get("/my", auth("user"), SearchFeedController.getMySearchFeed);

router.get("/", auth("admin"), SearchFeedController.getAllSearchFeed);

export const SearchFeedRoutes = router;
