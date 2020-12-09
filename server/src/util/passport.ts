/* eslint-disable @typescript-eslint/no-explicit-any */
import {Strategy as LocalStrategy} from "passport-local";
import {User} from "../model/user";
import * as UserService from "../service/user";

export const WRONG_CREDENTIALS = "WRONG_CREDENTIALS";

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: "password",
  usernameField: "username"
}, async (_, username, password, done) => {
  try {
    const user = await UserService.authenticate(username, password);
    if (!user) {
      return done(WRONG_CREDENTIALS);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

/**
 * @description Serializes a `User` object to a `SerializedUser`
 * @param user `User` model object
 * @param done Callback function
 */
export const serialize = (user: User, done: any) => {
  done(null, user.username);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (username: string, done: any) => {
  UserService.findOne(username).then((userObj) => {
    if (userObj === undefined) {
      done(null, {});
    } else {
      done(null, userObj);
    }
  });
};
