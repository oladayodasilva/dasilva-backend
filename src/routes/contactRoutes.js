// src/routes/contactRoutes.js
import express from "express";
import Contact from "../models/contactModel.js";

const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contact = new Contact({ fullname, email, message });
    await contact.save();

    res.status(201).json({ success: true, message: "Message sent!" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
