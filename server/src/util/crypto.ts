import argon from "argon2";
import crypto from "crypto";
import {ec as EC} from "elliptic";

// 투표 서명 및 검증에 필요한 정보
export interface Credentials {
  // 암호화된 서명 비밀키 (암호문 및 IV, `aesEncrypt@util/crypto` 참고)
  privateKey: string;
  // 서명 공개키
  publicKey: string;
  // PBKDF2 Salt
  passwordSalt: string;
}

export const hashPassword = argon.hash;
export const verifyPassword = argon.verify;

const randomBytes = (bytes: number) => new Promise<Buffer>((res, rej) => {
  crypto.randomBytes(bytes, (err, buf) => {
    if (err) rej(err);
    else res(buf);
  });
});

const pbkdf2 = (password: string, salt: Buffer, iterations: number, keylen: number, digest: string) => (
  new Promise<Buffer>((res, rej) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
      if (err) rej(err);
      else res(key);
    });
  })
);

const SECRET_CIPHER = "aes-256-gcm";
const PBKDF_ROUNDS = 100000;
const EC_CURVE = new EC("ed25519");

/**
 * @description AES-256-GCM 암호화를 합니다. 패딩은 Node.js 기본 (PKCS#5)를 이용합니다.
 * @param data 암호화 할 데이터
 * @param secret 대칭 키 (256비트)
 * @returns (암호문):(IV):(GCM authentication tag) 형태의 base64 string
 */
async function aesEncrypt(data: Buffer, secret: Buffer) {
  const iv = await randomBytes(32);
  const cipher = crypto.createCipheriv(SECRET_CIPHER, secret, iv);

  let cipherText = cipher.update(data);
  cipherText = Buffer.concat([cipherText, cipher.final()]);

  return cipherText.toString("base64") + ":" + iv.toString("base64") + ":" + cipher.getAuthTag().toString("base64");
}

/**
 * @description AES-256-GCM 복호화를 합니다. 패딩은 Node.js 기본 (PKCS#5)를 사용합니다.
 * @param data `aesEncrypt`의 반환 형식과 같은 암호문 및 nonce string
 * @param secret 대칭 키 (256비트)
 * @warning 복호화에 실패할 경우 예외가 발생할 수 있습니다.
 */
async function aesDecrypt(data: string, secret: Buffer) {
  const [cipherText, iv, authTag] = data.split(":");
  const decipher = crypto.createDecipheriv(SECRET_CIPHER, secret, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const clear = decipher.update(cipherText, "base64");
  return Buffer.concat([clear, decipher.final()]);
}

/**
 * @description 비밀번호 기반 서명 비밀키-공개키 쌍을 생성합니다.
 * @param password 생성에 사용할 비밀번호
 */
export async function createKey(password: string): Promise<Credentials> {
  // PBKDF2 salt 생성
  const pbkdfSalt = await randomBytes(32);
  // ECDSA 키 쌍 생성
  const signKey = EC_CURVE.genKeyPair();
  // ECDSA 비밀키 암호화를 위한 키 생성 및 암호화
  const secretKey = await pbkdf2(password, pbkdfSalt, PBKDF_ROUNDS, 32, "sha512");
  const encryptedPrivateKey = await aesEncrypt(signKey.getPrivate().toBuffer(), secretKey);

  return {
    privateKey: encryptedPrivateKey,
    publicKey: signKey.getPublic().encode("hex", false),
    passwordSalt: pbkdfSalt.toString("base64"),
  };
}

/**
 * @description 메세지를 서명합니다.
 * @param password 비밀키를 암호화 한 비밀번호
 * @param message 서명할 메세지
 * @param credentials 비밀키 관련 인증정보
 * @description hex로 인코딩 된 서명, 비밀번호 오류 등으로 서명에 실패할 경우 undefined
 */
export async function sign(password: string, message: string, credentials: Credentials): Promise<string | undefined> {
  try {
    // PBKDF2로 복호화 키 생성
    const secretKey = await pbkdf2(password, Buffer.from(credentials.passwordSalt, "base64"), PBKDF_ROUNDS, 32, "sha512");
    // ECDSA 비밀키 복호화
    const privateKey = await aesDecrypt(credentials.privateKey, secretKey);
    // 곡선 생성
    const signCurve = EC_CURVE.keyFromPrivate(privateKey, "hex");
    // 메세지 SHA-512 해싱 및 서명
    const msgHash = crypto.createHash("sha512");
    msgHash.update(message);
    const signature = signCurve.sign(msgHash.digest());
    return signature.toDER("hex");
  } catch {
    return undefined;
  }
}

/**
 * @description 메세지 서명을 검증합니다.
 * @param message 검증할 메세지
 * @param signature 메세지의 서명
 * @param publicKey 서명의 공개키
 * @returns 일치 여부
 */
export async function verify(message: string, signature: string, publicKey: string): Promise<boolean> {
  // 곡선 생성
  const signCurve = EC_CURVE.keyFromPublic(publicKey, "hex");
  // 메세지 SHA-512 해싱
  const msgHash = crypto.createHash("sha512");
  msgHash.update(message);
  // 서명 검증
  return signCurve.verify(msgHash.digest(), signature);
}
