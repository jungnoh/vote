import {User, UserModel, UserProfile} from "../model/user";
import {createKey, hashPassword, verifyPassword} from "../util/crypto";

export type USER_EXISTS = "EUSER_EXISTS";

/**
 * @description 로그인 정보와 일치하는 사용자를 조회합니다.
 * @param username 요청으로 들어온 사용자명
 * @param password 요청으로 들어온 비밀번호
 * @returns 사용자 정보가 알치할 경우 해당 User 객체, 일치하지 않을 경우 undefined
 */
export async function authenticate(username: string, password: string): Promise<User | undefined> {
  const foundUser = await UserModel.findOne({username});
  if (!foundUser) {
    return undefined;
  }
  const passwordEquals = await verifyPassword(foundUser.password, password);
  if (!passwordEquals) {
    return undefined;
  }
  return foundUser;
}

/**
 * @description 주어진 사용자명, 이메일, 학번 중 일치하는 사용자 프로픨을 찾습니다.
 * @param value 찾을 내용
 * @param type 찾을 필드
 * @returns 사용자가 존재할 경우 User 객체, 존재하지 않을 경우 undefined
 */
export async function findOne(value: string, type: "username" | "email" | "studentNumber" = "username"): Promise<User | undefined> {
  return await UserModel.findOne({[type]: value}) ?? undefined;
}

/**
 * @description 사용자를 생성합니다.
 * @param user 사용자 정보
 * @warning 반드시 validation / sanitization을 한 후에 이 함수로 요청을 넘겨줘야 합니다.
 */
export async function create(user: UserProfile & {password: string, votePassword: string}): Promise<USER_EXISTS | User> {
  user.studentNumber = user.studentNumber.trim();
  const userExists = await UserModel.exists({
    $or: [
      {username: user.username},
      {email: user.email},
      {studentNumber: user.studentNumber}
    ]
  });
  if (userExists) {
    return "EUSER_EXISTS";
  }
  const passwordHash = await hashPassword(user.password);
  const voteKeys = await createKey(user.votePassword);
  const userPayload = {
    ...user,
    password: passwordHash,
    voteKeys,
    adminLevel: 0
  } as (User & {votePassword?: string}); // 이래야 ts 에러가 안남
  delete userPayload.votePassword;
  
  const createdUser = await UserModel.create(userPayload);
  return createdUser;
}
