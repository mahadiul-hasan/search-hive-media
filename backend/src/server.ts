import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

process.on("uncaughtException", (error) => {
	process.exit(1);
});

let server: Server;

async function bootstrap() {
	try {
		await mongoose.connect(config.database_url as string);
		console.log(`🛢   Database is connected successfully`);

		server = app.listen(config.port, () => {
			console.log(`Application  listening on port ${config.port}`);
		});
	} catch (err) {
		console.log("Failed to connect database", err);
	}

	process.on("unhandledRejection", (error) => {
		if (server) {
			server.close(() => {
				process.exit(1);
			});
		} else {
			process.exit(1);
		}
	});
}

bootstrap();

process.on("SIGTERM", () => {
	if (server) {
		server.close();
	}
});
