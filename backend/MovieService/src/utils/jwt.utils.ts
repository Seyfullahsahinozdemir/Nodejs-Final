import jsonwebtoken, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import CustomResponse from "./custom.response";
import { Response } from "express";
const secretKey = "TechcareerNodeJSBootcamp";

export const generateToken = (payload: TokenPayload): string => {
  return jsonwebtoken.sign(payload, secretKey, { expiresIn: "1d" });
};

export const verifyToken = (
  token: string,
  res: Response
): TokenPayload | null => {
  try {
    const decodedToken = jsonwebtoken.verify(token, secretKey) as TokenPayload;
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export interface TokenPayload {
  username: string;
  isAdmin: boolean;
  userId: string;
  email: string;
}
