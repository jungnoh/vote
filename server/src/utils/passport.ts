/* eslint-disable @typescript-eslint/no-explicit-any */
import {Strategy as LocalStrategy} from "passport-local";
import {User} from "../db/models/user";
import * as UserService from "../services/user";

export const WRONG_CREDENTIALS = new Error("WRONG_CREDENTIALS");

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
export const serialize = (user: any, done: any) => {
  done(null, user.username);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (username: string, done: (err: any, result: false | User) => void) => {
  UserService.findOne("username", username).then((userObj) => {
    if (!userObj) {
      done(null, false);
    } else {
      done(null, userObj);
    }
  });
};
