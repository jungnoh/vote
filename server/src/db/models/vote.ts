import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  NotNull,
  Table,
} from "sequelize-typescript";

import { Room } from "./room";
import { User } from "./user";

@Table
export class VoteTopic extends Model {
  @NotNull
  @Column(DataType.STRING(120))
  title: string;

  @Column
  description: string;

  @ForeignKey(() => Room)
  @NotNull
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @CreatedAt
  createdAt: Date;

  @Column
  openAt: Date;

  @HasMany(() => VoteChoice)
  choices: VoteChoice[];
}

@Table
export class VoteChoice extends Model {
  @Column(DataType.STRING(120))
  title: string;

  @ForeignKey(() => VoteTopic)
  @NotNull
  @Column
  topicId: number;

  @BelongsTo(() => VoteTopic)
  topic: VoteTopic;

  @HasMany(() => VoteBallot)
  ballots: VoteBallot[];

  @NotNull
  @Default(1)
  @Column
  showOrder: number;
}

@Table
export class VoteBallot extends Model {
  @ForeignKey(() => User)
  @NotNull
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => VoteChoice)
  @NotNull
  @Column
  choiceId: number;

  @BelongsTo(() => VoteChoice)
  choice: VoteChoice;

  @CreatedAt
  createdAt: Date;
}
