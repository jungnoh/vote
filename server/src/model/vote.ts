// 투표 서명 및 검증에 필요한 정보
export interface Credentials {
  // 암호화된 서명 비밀키 (암호문 및 IV, `aesEncrypt@util/crypto` 참고)
  privateKey: string;
  // 서명 공개키
  publicKey: string;
  // PBKDF2 Salt
  passwordSalt: string;
}
