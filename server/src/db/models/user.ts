import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import Room from "./room";
import RoomJoinLog from "./roomJoinLog";
import VoteBallot from "./voteBallot";

@Table({tableName: "users"})
export default class User extends Model {
  @Column(DataType.STRING(32))
  username: string;

  @Column(DataType.STRING(120))
  email: string;

  @Column(DataType.STRING(240))
  password: string;

  @Column(DataType.STRING(32))
  fullName: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column(DataType.STRING(120))
  sparcsId: string;

  @HasMany(() => Room)
  owningRooms: Room[];

  @HasMany(() => VoteBallot)
  ballots: VoteBallot[];

  @HasMany(() => RoomJoinLog)
  roomJoinLogs: RoomJoinLog[];
}
