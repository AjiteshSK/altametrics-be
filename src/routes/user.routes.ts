import express, { Request, Response } from "express";
import { z } from "zod";
import { SignUp, SignIn, SignOut } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const signUpSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    });

    signUpSchema.parse(req.body);

    return await SignUp(req, res);
  } catch (error) {
    console.error("Validation error: /sign-up", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const signInSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
    });

    signInSchema.parse(req.body);

    return await SignIn(req, res);
  } catch (error) {
    console.error("Validation error: /sign-up", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.post("/sign-out", authenticate, async (req: Request, res: Response) => {
  //Add token to redist blacklist
  return await SignOut(req, res);
});

export default router;
