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

import User from "./user";

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
}
