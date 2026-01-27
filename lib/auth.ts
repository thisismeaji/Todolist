import { SignJWT, jwtVerify } from "jose"

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error("Missing JWT_SECRET in environment")
}

const encodedSecret = new TextEncoder().encode(secret)

export type AuthPayload = {
  sub: string
  email: string
}

export async function signAuthToken(payload: AuthPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret)
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify<AuthPayload>(token, encodedSecret)
    return payload
  } catch {
    return null
  }
}
