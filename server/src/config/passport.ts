import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import * as UserService from "../services/user";

import config from "./config";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== "ACCESS") {
      throw new Error("Invalid token type");
    }
    const user = await UserService.findOne("username", payload.value);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
export default jwtStrategy;
