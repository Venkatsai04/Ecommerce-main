// routes/reviewRoutes.js
import express from "express";
import Review from "../models/ReviewModel.js";
// import User from '../models/UserModel.js'; 

const router = express.Router();

// GET all reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "name");
    res.json({
      reviews: reviews.map(r => ({
        _id: r._id,
        userName: r.userId.name,
        rating: r.rating,
        review: r.description,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a review
router.post("/:productId", async (req, res) => {
  const { userId, description, rating } = req.body;

  if (!userId || !description || !rating) {
    return res.status(400).json({ message: "userId, description, and rating are required" });
  }

  try {
    const newReview = new Review({
      productId: req.params.productId,
      userId,
      description,
      rating,
    });

    const saved = await newReview.save();
    const populated = await saved.populate("userId", "name");

    res.status(201).json({
      review: {
        _id: populated._id,
        userName: populated.userId.name,
        rating: populated.rating,
        review: populated.description,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
