import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import httpStatus from "http-status";
import routers from "./app/routes";
import redirectRouter from "./app/modules/redirect/redirect.route";
import helmet from "helmet";
import { globalRateLimiter } from "./app/middleware/rateLimiter";

const app: Application = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.set("trust proxy", true);

app.disable("x-powered-by");

const allowedOrigins = [
	"http://localhost:5173",
	// "https://dashboard.searchhivemedia.com",
	// "https://searchhivemedia.com",
	// "https://adshuntmedia.com",
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);

app.use(globalRateLimiter);

app.use("/", redirectRouter);
app.use("/v1/", routers);

app.use(globalErrorHandler);

// handle not found error
app.use((req: Request, res: Response) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "Not Found",
	});
});

export default app;
