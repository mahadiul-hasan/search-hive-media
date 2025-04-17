import express from "express";
import auth from "../../middleware/auth";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/admin", auth("admin"), DashboardController.getAdminDashboardStat);
router.get("/user", auth("user"), DashboardController.getUserDashboardStat);

export const DashboardRoutes = router;
