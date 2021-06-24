import { Table, Column, Model, DataType, CreatedAt, NotNull, HasMany } from "sequelize-typescript";
import { Room, RoomJoinLog } from "./room";
import { VoteBallot } from "./vote";

@Table
export class User extends Model {
  @Column
  name: string;

  @NotNull
  @Column(DataType.STRING(32))
  username: string;

  @NotNull
  @Column(DataType.STRING(120))
  email: string;

  @NotNull
  @Column(DataType.STRING(240))
  password: string;

  @NotNull
  @Column(DataType.STRING(32))
  fullName: string;

  @CreatedAt
  createdAt: Date;

  @NotNull
  @Column(DataType.STRING(120))
  sparcsId: string;

  @HasMany(() => Room)
  owningRooms: Room[];

  @HasMany(() => VoteBallot)
  ballots: VoteBallot[];

  @HasMany(() => RoomJoinLog)
  roomJoinLogs: RoomJoinLog[];
}
