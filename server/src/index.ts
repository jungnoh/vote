import connectSessionSeq from "connect-session-sequelize";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import httpStatus from "http-status";
import passport from "passport";
import { Sequelize } from "sequelize-typescript";
import xss from "xss-clean";

import config from "./config/config";
import logger from "./config/logger";
import jwtStrategy from "./config/passport";
import { errorConverter, errorHandler } from "./middlewares/error";
import router from "./routes";
import ApiError from "./utils/ApiError";

export default async function createApp() {
  // Set configs
  if (config.env === "development") {
    logger.debug("Running in development mode");
  }

  const sequelize = new Sequelize({
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOSTNAME!,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    dialect: "postgres",
    models: [__dirname + "/db/models/*.ts"],
  });
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

  // Passport
  app.use(passport.initialize());
  passport.use(jwtStrategy);

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
