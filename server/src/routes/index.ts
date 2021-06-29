import { Router } from "express";

import roomRouter from "./room";
import userRouter from "./user";

const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/room", roomRouter);

export default rootRouter;
