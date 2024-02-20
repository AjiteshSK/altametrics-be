import Review from "../models/reviews.models";
import { Request, Response } from "express";

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    let { book, rating, review, status } = req.body;
    if (status === "want to read") {
      review = "";
      rating = 0;
    }
    const newReview = await Review.create({
      user: userId,
      book,
      rating,
      review,
      status,
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
    const { book } = req.params;

    const review = await Review.findOne({
      where: {
        book,
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
    let { rating, review, book, status } = req.body;

    if (status === "want to read") {
      review = "";
      rating = 0;
    }

    if (status === "none") {
      return await deleteReview(req, res);
    }
    const [updatedReview, created] = await Review.upsert({
      user: userId,
      book,
      rating,
      review,
      status,
    });

    if (created) {
      res.send("Review created successfully");
    } else {
      res.status(200).send("Review updated");
    }
  } catch (error) {
    console.error("UpdateReview Error:", error);
    res.status(500).send("Error updating review");
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { book } = req.params;
    const deletedReview = await Review.destroy({
      where: { book, user: userId },
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
