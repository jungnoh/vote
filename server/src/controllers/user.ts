import { Request, Response } from "express";
import httpStatus from "http-status";
import { pick } from "lodash";

import * as TokenService from "../services/token";
import * as UserService from "../services/user";

export async function login(req: Request, res: Response) {
  const user = await UserService.authenticate(req.body.username, req.body.password);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({});
  }
  const token = await TokenService.createToken("ACCESS", user.username);
  return res.json({
    user: pick(user, ["username", "email", "fullName", "sparcsId"]),
    token
  });
}