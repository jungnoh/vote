import { Table, Model, ForeignKey, Column, BelongsTo, CreatedAt, UpdatedAt } from "sequelize-typescript";

import User from "./user";
import VoteChoice from "./voteChoice";

@Table({tableName: "vote_ballots"})
export default class VoteBallot extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => VoteChoice)
  @Column
  choiceId: number;

  @BelongsTo(() => VoteChoice)
  choice: VoteChoice;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
