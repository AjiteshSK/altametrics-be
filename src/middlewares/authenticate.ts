import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../redisClient";

interface UserData {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserData;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token, { json: true });
    const tokenSignature = decodedToken?.jti;

    const keys = await redisClient.keys("*");
    const isBlacklisted = await redisClient.get(`blacklist:${tokenSignature}`);
    if (isBlacklisted) {
      return res.status(401).send("Token is blacklisted");
    }
    const user = jwt.verify(token, "secret_key");

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    req.user = user as UserData;
    next();
  } catch (error) {
    console.error("Error in authenticate", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
