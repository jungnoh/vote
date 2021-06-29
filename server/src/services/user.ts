import { randomBytes } from "crypto";

import { Op, Transaction } from "sequelize";

import Connection from "../db/connection";
import User from "../db/models/user";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { UserInformation } from "../utils/sso";

interface NewUser {
  name: string;
  username: string;
  password: string;
  fullName: string;
  sparcsId: string;
  email: string;
}

/**
 * @description 로그인 정보와 일치하는 사용자를 조회합니다.
 * @param username 요청으로 들어온 사용자명
 * @param password 요청으로 들어온 비밀번호
 * @returns 사용자 정보가 알치할 경우 해당 User 객체, 일치하지 않을 경우 undefined
 */
export async function authenticate(
  username: string,
  password: string
): Promise<User | null> {
  const foundUser = await User.findOne({
    where: {
      username,
    },
  });
  if (!foundUser) {
    return null;
  }
  const passwordEquals = await verifyPassword(foundUser.password, password);
  if (!passwordEquals) {
    return null;
  }
  return foundUser;
}

export async function findOne(
  type: "username" | "sparcsId" | "email",
  value: string
): Promise<User | null> {
  const user = await User.findOne({
    where: {
      [type]: value,
    }
  });
  return user;
}

/**
 * @description 사용자를 생성합니다.
 * @param user 사용자 정보
 * @warning 반드시 validation / sanitization을 한 후에 이 함수로 요청을 넘겨줘야 합니다.
 */
export async function create(user: NewUser): Promise<User> {
  const userExists = await User.count({
    where: {
      [Op.or]: [
        { sparcsId: user.sparcsId },
        { username: user.name },
        { email: user.email },
      ],
    },
  });
  if (userExists) {
    const err = new Error("User exists");
    err.name = "EUSER_EXISTS";
    throw err;
  }
  const passwordHash = await hashPassword(user.password);
  const userPayload = {
    ...user,
    password: passwordHash,
  };

  const createdUser = await User.create(userPayload);
  return createdUser;
}

export async function ensureSsoUser(info: UserInformation): Promise<User> {
  return await Connection.db().transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async t => {
    const existingUser = await User.findOne({where: {sparcsId: info.sparcs_id}, transaction: t});
    if (existingUser) {
      existingUser.email = info.email;
      existingUser.fullName = `${info.last_name}${info.first_name}`;
      await existingUser.save();
      return existingUser;
    }
    const passwordHash = await hashPassword(randomBytes(8));
    const createdUser = await User.create({
      username: info.sparcs_id,
      email: info.email,
      password: passwordHash,
      fullName: `${info.last_name}${info.first_name}`,
      sparcsId: info.sparcs_id
    }, {transaction: t});
    return createdUser;
  });
}
