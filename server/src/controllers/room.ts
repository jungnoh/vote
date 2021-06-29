import { Request, Response } from "express";

import * as RoomService from "../services/room";

export async function createRoom(req: Request, res: Response) {
  const room = await RoomService.createRoom(req.user!, req.body.name);
  return res.json(room);
}