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
  UpdatedAt,
} from "sequelize-typescript";

import Room from "./room";
import VoteChoice from "./voteChoice";

@Table({tableName: "vote_topics"})
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

  @UpdatedAt
  updatedAt: Date;

  @AllowNull
  @Column
  openAt: Date;

  @HasMany(() => VoteChoice)
  choices: VoteChoice[];
}

