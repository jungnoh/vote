import MongoStore from "connect-mongo";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import passport from "passport";
import { handleError } from "./middleware/error";
import router from "./route";
import morgan from "morgan";
// import * as PassportStrategy from "./utils/passport";
import cookieParser from "cookie-parser";

const isDev = process.env.NODE_ENV === "development";

async function setup() {
  if (isDev) {
    console.log("Running in development mode");
  }
  if (process.env.MONGO_HOST === undefined) {
    console.error("MONGO_HOST not found");
    process.exit(1);
  }
  const mongooseConfig: mongoose.ConnectionOptions = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(process.env.MONGO_HOST, mongooseConfig);
}

export default async function createApp() {
  // Set configs
  await setup();
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
      secret: process.env.SESSION_SECRET!,
      store: new (MongoStore(expressSession))({
        mongooseConnection: mongoose.connection,
      }),
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
  // passport.use(PassportStrategy.localStrategy);
  // passport.serializeUser(PassportStrategy.serialize);
  // passport.deserializeUser(PassportStrategy.deserialize);
  // app.use((req, _, next) => {
  //   if (
  //     !req.session?.passport ||
  //     JSON.stringify(req.session.passport) === "{}"
  //   ) {
  //     req.user = undefined;
  //   }
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   req.currentUser = req.user as any;
  //   next();
  // });
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
