import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.SECRET_KEY);

export const signJwt = (payload: jose.JWTPayload) => new jose.SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(secret);

export const verifyJwt = (token: string) => jose.jwtVerify(token, secret).catch(() => false);
