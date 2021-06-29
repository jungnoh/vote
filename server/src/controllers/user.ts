import { Request, Response } from "express";
import httpStatus from "http-status";
import { pick } from "lodash";

import CONFIG from "../config/config";
import * as TokenService from "../services/token";
import * as UserService from "../services/user";
import Client from "../utils/sso";

const ssoClient = new Client(CONFIG.sso.key, CONFIG.sso.secret);

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

export async function ssoLoginStart(req: Request, res: Response) {
  const {url, state} = ssoClient.getLoginParams();
  (req.session as any).ssoState = state;
  res.redirect(url);
}

export async function ssoLoginFinish(req: Request, res: Response) {
  const {code, state} = req.query;
  const sessionState = (req.session as any).ssoState;
  if (state !== sessionState) {
    res.status(httpStatus.BAD_REQUEST).json({reason: "Token state mismatch"});
    return;
  }
  // TODO: try-catch
  const result = await ssoClient.getUserInfo(code);
  if (result.sparcs_id === "") {
    res.status(httpStatus.FORBIDDEN).json({reason: "Only SPARCS members are allowed"});
    return;
  }
  const user = await UserService.ensureSsoUser(result);
  const token = await TokenService.createToken("ACCESS", user.username);
  return res.json({
    user: pick(user, ["username", "email", "fullName", "sparcsId"]),
    token
  });
}
