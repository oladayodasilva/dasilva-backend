// backend/src/routes/upload.js (ESM)
import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const uploader = multer({ storage });

// POST /api/upload  (multiple images)
router.post("/", uploader.array("images", 10), (req, res) => {
  try {
    // req.files should be an array with .path (url) when using CloudinaryStorage
    const urls = (req.files || []).map((f) => f.path || f.url || f.secure_url);
    return res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
