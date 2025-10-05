// checkImages.js
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Product from "./src/models/productModel.js"; // ✅ correct import path
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === 1️⃣ Load environment variables ===
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://"))) {
  console.error("❌ Invalid or missing MONGO_URI. Please check your .env file.");
  process.exit(1);
}

console.log(`🧩 Connecting to MongoDB: ${MONGO_URI.split("@")[1]}`); // logs part of the connection for safety

async function runCheck() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products in database.`);

    // === Define image folder path ===
    const imagesDir = path.resolve(__dirname, "../public/images");
    const existingImages = new Set(fs.readdirSync(imagesDir));
    console.log(`🖼️ Found ${existingImages.size} images in /public/images`);

    let missingCount = 0;

    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        console.log(`⚠️ ${product.name}: no images in DB`);
        continue;
      }

      for (const img of product.images) {
        if (!existingImages.has(img)) {
          console.log(`❌ Missing image file: ${img} (used by "${product.name}")`);
          missingCount++;
        }
      }
    }

    console.log(
      missingCount === 0
        ? "✅ All database image files exist in /public/images"
        : `🚨 ${missingCount} missing image files found.`
    );
  } catch (err) {
    console.error("❌ Error running image check:", err);
  } finally {
    mongoose.connection.close();
  }
}

runCheck();
