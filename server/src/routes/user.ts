import { Router } from "express";

import * as UserController from "../controllers/user";
import validate from "../middlewares/validation";
import wrapAsync from "../utils/wrap";
import * as UserValidation from "../validators/user";

const userRouter = Router();

userRouter.post("/login", validate(UserValidation.login), wrapAsync(UserController.login));
userRouter.get("/login/sso", wrapAsync(UserController.ssoLoginStart));
userRouter.get("/login/sso-finish", validate(UserValidation.loginSSOFinish), wrapAsync(UserController.ssoLoginFinish));

export default userRouter;
