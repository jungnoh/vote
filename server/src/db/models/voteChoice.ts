import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany, Default } from "sequelize-typescript";

import VoteBallot from "./voteBallot";
import VoteTopic from "./voteTopic";

@Table
export default class VoteChoice extends Model {
  @Column(DataType.STRING(120))
  title: string;

  @ForeignKey(() => VoteTopic)
  @Column
  topicId: number;

  @BelongsTo(() => VoteTopic)
  topic: VoteTopic;

  @HasMany(() => VoteBallot)
  ballots: VoteBallot[];

  @Default(1)
  @Column
  showOrder: number;
}