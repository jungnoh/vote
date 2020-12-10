import mongoose from "mongoose";
import { TimestampedDocument } from ".";
import { Credentials } from "./vote";

export interface UserProfile {
  // 사용자명
  username: string;
  // 이메일
  email: string;
  // 이름
  name: string;
  // 학번
  studentNumber: string;
}

export interface User extends UserProfile, TimestampedDocument {
  // 비밀번호
  password: string;
  // 관리자 권한
  adminLevel: number;
  // 투표 관련 키
  voteKeys: Credentials;
}

const schema = new mongoose.Schema({
  adminLevel: {
    default: 0,
    required: true,
    type: Number
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  studentNumber: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  voteKeys: {
    type: {
      privateKey: String,
      publicKey: String,
      passwordSalt: String
    },
    required: true
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<User>("User", schema);
