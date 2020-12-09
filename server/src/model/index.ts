import {Document} from "mongoose";

export interface TimestampedDocument extends Document {
  createdAt: string;
  updatedAt: string;
}