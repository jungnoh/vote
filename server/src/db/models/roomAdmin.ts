import { Table, Model, ForeignKey, Column, BelongsTo } from "sequelize-typescript";

import Room from "./room";
import User from "./user";

@Table
export default class RoomAdmin extends Model {
  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}