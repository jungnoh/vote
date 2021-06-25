import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";

import Room from "./room";
import VoteChoice from "./voteChoice";

@Table
export default class VoteTopic extends Model {
  @Column(DataType.STRING(120))
  title: string;

  @Column
  description: string;

  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @CreatedAt
  createdAt: Date;

  @AllowNull
  @Column
  openAt: Date;

  @HasMany(() => VoteChoice)
  choices: VoteChoice[];
}

