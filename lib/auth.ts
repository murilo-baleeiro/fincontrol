import jwt from "jsonwebtoken";

const SECRET = process.env.ACCESS_TOKEN_SECRET || "change_this_in_env";

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
