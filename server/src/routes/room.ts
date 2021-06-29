import { Router } from "express";

import * as RoomController from "../controllers/room";
import { checkLogin } from "../middlewares/auth";
import validate from "../middlewares/validation";
import wrapAsync from "../utils/wrap";
import * as RoomValidation from "../validators/room";

const roomRouter = Router();
roomRouter.use(checkLogin);

roomRouter.post("/", validate(RoomValidation.createRoom), wrapAsync(RoomController.createRoom));

export default roomRouter;
