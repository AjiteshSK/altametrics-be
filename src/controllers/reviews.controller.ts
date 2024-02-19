import Review from "../models/reviews.models";
import { Request, Response } from "express";

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { isbn, rating, review } = req.body;

    const newReview = await Review.create({
      user: userId,
      isbn,
      rating,
      review,
    });
    return res.status(200).json({ message: "Added review" });
  } catch (error) {
    console.error("AddReview Error:", error);
    res.status(500).send("Error creating review");
  }
};

export const getReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { isbn } = req.body;

    const review = await Review.findOne({
      where: {
        isbn,
        user: userId,
      },
    });

    if (review) {
      res.json(review);
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("GetReview Error:", error);
    res.status(500).send("Error fetching review");
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { rating, review, isbn } = req.body;
    const updatedReview = await Review.update(
      { rating, review },
      { where: { isbn, user: userId } }
    );

    if (updatedReview[0] > 0) {
      res.send("Review updated successfully");
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("UpdateReview Error:", error);
    res.status(500).send("Error updating review");
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { isbn } = req.body;
    const deletedReview = await Review.destroy({
      where: { isbn, user: userId },
    });

    if (deletedReview) {
      res.send("Review deleted successfully");
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("DeleteReview Error:", error);
    res.status(500).send("Error deleting review");
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const allReviews = await Review.findAll({ where: { user: userId } });

    if (allReviews.length > 0) {
      res.json(allReviews);
    } else {
      res.status(404).send("No reviews found for the specified user.");
    }
  } catch (error) {
    console.error("GetAllReview Error:", error);
    res.status(500).send("Error fetching all reviews");
  }
};
