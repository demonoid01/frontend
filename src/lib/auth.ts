import { JWTPayload, jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_TOKEN_SECRET_KEY;

export async function signToken(payload: JWTPayload) {
    if (!JWT_SECRET) {
        throw new Error("JWT_TOKEN_SECRET_KEY is not set in environment variables");
    }
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1w")
        .sign(secretKey);
    return token;
}

export async function verifyToken(token: string | Uint8Array) {
    try {
        const secretKey = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.log(error);
        return null;
    }
}