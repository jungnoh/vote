import { DataTypes } from "sequelize";
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import RoomAdmin from "./roomAdmin";
import User from "./user";

export type RoomState = "created" | "started" | "ended";

@Table({tableName: "rooms"})
export default class Room extends Model {
  @Column(DataType.STRING(120))
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column
  startedAt: Date;

  @Column
  endedAt: Date;

  @AllowNull
  @ForeignKey(() => User)
  @Column({ type: DataTypes.INTEGER, onDelete: "SET NULL" })
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;

  get state(): RoomState {
    if (this.endedAt) {
      return "ended";
    }
    if (this.startedAt) {
      return "started";
    }
    return "created";
  }

  async assignStaff(staff: User) {
    await RoomAdmin.upsert({
      roomId: this.id,
      userId: staff.id
    });
  }

  async removeStaff(staff: User) {
    await RoomAdmin.destroy({
      where: {
        roomId: this.id,
        userId: staff.id
      }
    });
  }
}
