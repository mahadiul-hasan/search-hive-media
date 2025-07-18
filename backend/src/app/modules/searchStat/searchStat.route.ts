import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { SearchStatValidation } from "./searchStat.validation";
import { SearchStatController } from "./searchStat.controller";

const router = express.Router();

router.patch(
	"/:id",
	validateRequest(SearchStatValidation.update),
	auth("admin"),
	SearchStatController.updateSearchStat
);

router.delete("/:id", auth("admin"), SearchStatController.deleteSearchStat);
router.delete(
	"/",
	auth("admin"),
	SearchStatController.deleteMultipleSearchStats
);

router.get(
	"/single/:id",
	auth("admin"),
	SearchStatController.getSingleSearchStat
);

router.get("/my", auth("user"), SearchStatController.getMySearchStat);

router.get("/", auth("admin"), SearchStatController.getAllSearchStat);

export const SearchStatRoutes = router;
