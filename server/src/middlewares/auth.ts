import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { verifyToken } from "../services/token";
import * as UserService from "../services/user";

export async function jwt(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization") ?? "";
    if (token === "") {
      next();
      return;
    }
    const payload = await verifyToken(token);
    if (!payload || payload.type !== "ACCESS") {
      next();
      return;
    }
    const user = await UserService.findOne("username", payload.value as string);
    if (!user) {
      next();
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    next();
  }
}

export function checkLogin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(httpStatus.UNAUTHORIZED).json({});
    return;
  }
  next();
}