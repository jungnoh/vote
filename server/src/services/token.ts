import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError, VerifyErrors } from "jsonwebtoken";

import config from "../config/config";

type JSONObject = string | number | boolean | null | JSONObject[] | { [key: string]: JSONObject };

export async function createToken(type: "ACCESS", value: JSONObject): Promise<string> {
  return jwt.sign({ type, value }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration
  });
}

export async function verifyToken(token: string): Promise<{error: null | VerifyErrors, payload?: JSONObject}> {
  try {
    const result = jwt.verify(token, config.jwt.secret);
    return {error: null, payload: JSON.stringify(result)};
  } catch (err) {
    if ([JsonWebTokenError, TokenExpiredError, NotBeforeError].some(v => err instanceof v)) {
      return {error: err};
    }
    throw err;
  }
}
