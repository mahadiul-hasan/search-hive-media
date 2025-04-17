import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import httpStatus from "http-status";
import routers from "./app/routes";
import redirectRouter from "./app/modules/redirect/redirect.route";

const app: Application = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	cors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
		credentials: true,
	})
);

app.use("/", redirectRouter);
app.use("/v1/", routers);

app.use(globalErrorHandler);

// handle not found error
app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "Not Found",
	});
	next();
});

export default app;
