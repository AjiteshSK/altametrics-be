import { Request, Response } from "express";
import User from "../models/users.models";
import bcrypt, { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import redisClient from "../redisClient";

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(409).send("Email already in use");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User created successfully",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).send("Error signing up user");
  }
};

export const SignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect E-mail or password" });
    }
    const jti = uuidv4();

    const token = jwt.sign(
      { id: user.id, email: user.email, jti },
      "secret_key",
      {
        expiresIn: "1d",
      }
    );

    return res.json({ message: "Authentication successful", token });
  } catch (error) {
    console.error("SignIn Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const SignOut = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token, { json: true });
    if (!decodedToken) {
      return res.status(400).send("Invalid token");
    }
    const tokenSignature = decodedToken?.jti;
    const ttl = 86400;
    await redisClient.set(`blacklist:${tokenSignature}`, "true", "EX", ttl);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("SignOut Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
