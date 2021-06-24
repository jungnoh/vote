import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import passport from "passport";
import { handleError } from "./middlewares/error";
import router from "./routes";
import morgan from "morgan";
import * as PassportStrategy from "./utils/passport";
import cookieParser from "cookie-parser";
import { Sequelize } from "sequelize-typescript";

const isDev = process.env.NODE_ENV === "development";

export default async function createApp() {
  // Set configs
  if (isDev) {
    console.log("Running in development mode");
  }

  new Sequelize({
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOSTNAME!,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    dialect: "postgres",
    models: [__dirname + "/model"]
  });

  const app = express();
  // Express session
  app.use(
    expressSession({
      cookie: {
        httpOnly: false, // Client-side XHR will be used
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!
    })
  );

  app.use(helmet());
  app.use(morgan("dev"));
  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(PassportStrategy.localStrategy);
  passport.serializeUser(PassportStrategy.serialize);
  passport.deserializeUser(PassportStrategy.deserialize);
  // Routes
  app.use(router);
  // Error handling
  app.use(handleError);
  app.all("*", (_, res) => {
    res.status(404).json({ success: false });
  });
  // All set!
  return app;
}
