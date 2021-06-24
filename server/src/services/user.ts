import { Op } from "sequelize";
import { User } from "../db/models/user";
import { hashPassword, verifyPassword } from "../utils/crypto";

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
export async function authenticate(username: string, password: string): Promise<User | null> {
  const foundUser = await User.findOne({
    where: {
      username
    }
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

export async function findOne(type: "username" | "string", value: string): Promise<User | null> {
  const user = await User.findOne({
    [type]: value
  });
  return user;
}

/**
 * @description 사용자를 생성합니다.
 * @param user 사용자 정보
 * @warning 반드시 validation / sanitization을 한 후에 이 함수로 요청을 넘겨줘야 합니다.
 */
export async function create(user: NewUser): Promise<Error | User> {
  const userExists = await User.count({
    where: {
      [Op.or]: [
        { sparcsId: user.sparcsId },
        { username: user.name },
        { email: user.email }
      ]
    }
  });
  if (userExists) {
    return new Error("EUSER_EXISTS");
  }
  const passwordHash = await hashPassword(user.password);
  const userPayload = {
    ...user,
    password: passwordHash,
  };
  
  const createdUser = await User.create(userPayload);
  return createdUser;
}
