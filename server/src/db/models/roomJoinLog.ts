import { Table, Model, ForeignKey, Column, BelongsTo, DataType, CreatedAt, AllowNull } from "sequelize-typescript";

import Room from "./room";
import User from "./user";

@Table
export default class RoomJoinLog extends Model {
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

  @Column(DataType.STRING(40))
  ip: string;

  @CreatedAt
  joinedAt: Date;

  @AllowNull
  @Column
  leavedAt: Date;
}
