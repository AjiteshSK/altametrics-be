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
      isbn: z.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\dXx-]+$/, {
        message:
          "ISBN must be either 10 or 13 digits long, with the 10th digit possibly being 'X'",
      }),
      rating: z
        .number()
        .min(1, { message: "Number must be at least 1" })
        .max(5, { message: "Number must be no more than 5" }),
      review: z.string(),
    });

    addReviewSchema.parse(req.body);
    return await addReview(req, res);
  } catch (error) {
    console.error("Validation error: /add-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.get("/get-review", authenticate, async (req, res) => {
  try {
    const getReviewSchema = z.object({
      isbn: z.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\dXx-]+$/, {
        message:
          "ISBN must be either 10 or 13 digits long, with the 10th digit possibly being 'X'",
      }),
    });
    getReviewSchema.parse(req.body);
    return await getReview(req, res);
  } catch (error) {
    console.error("Validation error: /get-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.put("/update-review", authenticate, async (req, res) => {
  try {
    const updateReviewSchema = z.object({
      isbn: z.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\dXx-]+$/, {
        message:
          "ISBN must be either 10 or 13 digits long, with the 10th digit possibly being 'X'",
      }),
      rating: z
        .number()
        .min(1, { message: "Number must be at least 1" })
        .max(5, { message: "Number must be no more than 5" }),
      review: z.string(),
    });

    updateReviewSchema.parse(req.body);
    return await updateReview(req, res);
  } catch (error) {
    console.error("Validation error: /get-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.delete("/delete-review/", authenticate, async (req, res) => {
  try {
    const deleteReviewSchema = z.object({
      isbn: z.string().regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\dXx-]+$/, {
        message:
          "ISBN must be either 10 or 13 digits long, with the 10th digit possibly being 'X'",
      }),
    });
    deleteReviewSchema.parse(req.body);
    return await deleteReview(req, res);
  } catch (error) {
    console.error("Validation error: /get-review", error);
    return res.status(400).json({ message: "Invalid request" });
  }
});

router.get("/get-all-reviews", authenticate, async (req, res) => {
  return await getAllReviews(req, res);
});

export default router;
