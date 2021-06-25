import { Table, Model, ForeignKey, Column, BelongsTo, CreatedAt } from "sequelize-typescript";

import User from "./user";
import VoteChoice from "./voteChoice";

@Table
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
}
