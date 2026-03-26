// Types cho module Auth

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;   // user id
  role: string;
  iat: number;
  exp: number;
  jti?: string;  // JWT ID — dùng cho token blacklist
}
