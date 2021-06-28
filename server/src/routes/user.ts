import { Router } from "express";

import * as UserController from "../controllers/user";
import validate from "../middlewares/validation";
import wrapAsync from "../utils/wrap";
import * as UserValidation from "../validators/user";

const userRouter = Router();

userRouter.post("/login", validate(UserValidation.login), wrapAsync(UserController.login));

export default userRouter;
