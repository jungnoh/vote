import { NextFunction, Request, Response } from "express";

type WrapFunc = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const wrapAsync = (fn: WrapFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default wrapAsync;
