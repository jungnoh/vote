import connectSessionSeq from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import httpStatus from "http-status";
import xss from "xss-clean";

import config from "./config/config";
import logger from "./config/logger";
import Connection from "./db/connection";
import { jwt } from "./middlewares/auth";
import { errorConverter, errorHandler } from "./middlewares/error";
import router from "./routes";
import ApiError from "./utils/ApiError";
import wrapAsync from "./utils/wrap";

export default async function createApp() {
  // Set configs
  if (config.env === "development") {
    logger.debug("Running in development mode");
  }

  const sequelize = Connection.db();
  const sequelizeStore = new (connectSessionSeq(expressSession.Store))({
    db: sequelize,
    tableName: "sessions",
  });

  const app = express();

  // Security
  app.use(helmet());
  app.use(xss());

  app.use(cors());
  app.options("*", cors());

  // Express session
  app.use(
    expressSession({
      cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      store: sequelizeStore,
    })
  );

  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // JWT
  app.use(wrapAsync(jwt));

  // Routes
  app.use(router);
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  });

  // Error handling
  app.use(errorConverter);
  app.use(errorHandler);

  // All set!
  return app;
}
