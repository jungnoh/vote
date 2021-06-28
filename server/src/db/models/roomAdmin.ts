import { Table, Model, ForeignKey, Column, BelongsTo, CreatedAt, UpdatedAt } from "sequelize-typescript";

import Room from "./room";
import User from "./user";

@Table({tableName: "room_admins"})
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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}