import express from "express";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate";
import {
  addReview,
  getReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../controllers/reviews.controller";
const router = express.Router();

router.post("/add-review", authenticate, async (req, res) => {
  try {
    const addReviewSchema = z.object({
      book: z.string(),
      rating: z
        .number()
        .min(0, { message: "Number must be at least 0" })
        .max(5, { message: "Number must be no more than 5" }),
      review: z.string(),
      status: z.enum(["read", "want to read"]),
    });

    addReviewSchema.parse(req.body);
    return await addReview(req, res);
  } catch (error) {
    console.error("Validation error: /add-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.get("/get-review/:book", authenticate, async (req, res) => {
  try {
    const getReviewSchema = z.object({
      book: z.string(),
    });

    getReviewSchema.parse({ book: req.params.book });
    return await getReview(req, res);
  } catch (error) {
    console.error("Validation error: /get-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.put("/update-review", authenticate, async (req, res) => {
  try {
    const updateReviewSchema = z.object({
      book: z.string(),
      rating: z
        .number()
        .min(0, { message: "Number must be at least 1" })
        .max(5, { message: "Number must be no more than 5" }),
      review: z.string(),
      status: z.enum(["read", "want to read"]),
    });

    updateReviewSchema.parse(req.body);
    return await updateReview(req, res);
  } catch (error) {
    console.error("Validation error: /update-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.delete("/delete-review/:book", authenticate, async (req, res) => {
  try {
    const deleteReviewSchema = z.object({
      book: z.string(),
    });
    deleteReviewSchema.parse({ book: req.params.book });
    return await deleteReview(req, res);
  } catch (error) {
    console.error("Validation error: /delete-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.get("/get-all-reviews", authenticate, async (req, res) => {
  return await getAllReviews(req, res);
});

export default router;
