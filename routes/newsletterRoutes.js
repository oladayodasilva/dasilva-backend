import express from "express";
import Newsletter from "../src/models/newsletterModel.js";

const router = express.Router();

// @route   POST /api/newsletter
// @desc    Subscribe email
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // prevent duplicate
    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSub = await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully!", sub: newSub });
  } catch (err) {
    console.error("❌ Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
