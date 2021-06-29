import { Transaction } from "sequelize";

import Room from "../db/models/room";
import RoomJoinLog from "../db/models/roomJoinLog";
import User from "../db/models/user";

export async function getLastRoomLog(user: User, transaction?: Transaction): Promise<RoomJoinLog | null> {
  return await RoomJoinLog.findOne({
    where: {
      userId: user.id,
      leavedAt: null
    },
    include: {
      model: Room,
      required: true
    },
    transaction
  });
}

export async function getCurrentRoom(user: User, transaction?: Transaction): Promise<Room | null> {
  const stayingLog = await getLastRoomLog(user, transaction);
  if (stayingLog) {
    return stayingLog.room;
  }
  return null;
}

export async function setCurrentRoom(user: User, ip: string, room: number | Room, transaction?: Transaction) {
  const actionDate = new Date();
  const newRoomId = typeof room === "number" ? room : (room.id as number);
  const lastRoomLog = await getLastRoomLog(user, transaction);
  if (lastRoomLog && lastRoomLog.roomId === newRoomId) {
    return;
  }
  if (lastRoomLog && lastRoomLog.roomId !== newRoomId) {
    lastRoomLog.leavedAt = actionDate;
    await lastRoomLog.save({transaction});
  }
  await RoomJoinLog.create({
    roomId: newRoomId,
    userId: user.id,
    ip,
    joinedAt: actionDate,
    updatedAt: actionDate,
  }, {raw: true, transaction});
}

export async function createRoom(owner: User, name: string, transaction?: Transaction) {
  const newRoom = await Room.create({
    name,
    ownerId: owner.id
  }, {transaction});
  return newRoom;
}

export async function getRoom(id: number) {
  return await Room.findOne({where: {id}});
}
