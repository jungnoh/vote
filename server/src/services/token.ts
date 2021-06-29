import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";

import config from "../config/config";

type JSONObject = string | number | boolean | null | JSONObject[] | { [key: string]: JSONObject };

interface TokenData {
  type: string;
  value: JSONObject;
  iat: number;
  ext: number;
}

export async function createToken(type: "ACCESS", value: JSONObject): Promise<string> {
  return jwt.sign({ type, value }, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpiration}s`
  });
}

export async function verifyToken(token: string): Promise<TokenData> {
  try {
    const result = jwt.verify(token, config.jwt.secret);
    return result as TokenData;
  } catch (err) {
    if ([JsonWebTokenError, TokenExpiredError, NotBeforeError].some(v => err instanceof v)) {
      const myError = new Error(`${err.name}: Invalid token`);
      myError.name = "InvalidTokenError";
      throw myError;
    }
    throw err;
  }
}
