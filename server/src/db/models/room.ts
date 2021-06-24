import { Table, Column, Model, DataType, CreatedAt, ForeignKey, BelongsTo, NotNull } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { User } from "./user";

@Table
export class Room extends Model {
  @Column(DataType.STRING(120))
  name: string;

  @CreatedAt
  createdAt: Date;

  @Column
  startedAt: Date;

  @Column
  endedAt: Date;

  @ForeignKey(() => User)
  @NotNull
  @Column({type: DataTypes.INTEGER, onDelete: "SET NULL"})
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;
}

@Table
export class RoomAdmin extends Model {
  @ForeignKey(() => Room)
  @NotNull
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @ForeignKey(() => User)
  @NotNull
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}

@Table
export class RoomJoinLog extends Model {
  @ForeignKey(() => Room)
  @NotNull
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @ForeignKey(() => User)
  @NotNull
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @NotNull
  @Column(DataType.STRING(40))
  ip: string;

  @CreatedAt
  joinedAt: Date;

  @Column
  leavedAt: Date;
}
