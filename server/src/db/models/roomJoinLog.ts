import { Table, Model, ForeignKey, Column, BelongsTo, DataType, CreatedAt, AllowNull, UpdatedAt } from "sequelize-typescript";

import Room from "./room";
import User from "./user";

@Table({tableName: "room_join_logs"})
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

  @UpdatedAt
  updatedAt: Date;

  @AllowNull
  @Column
  leavedAt: Date;
}
