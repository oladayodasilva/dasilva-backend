// migrateImages.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/productModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dasilva";

await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("✅ Connected to MongoDB");

// Define mapping between product names and local image filenames
const imageMap = {
  "Élixir": ["elixir1.jpg", "elixir2.jpg", "elix1.JPG", "elix2.JPG"],
  "iNTENTIONS": ["intentions-alone.jpg", "i2.JPG", "i5.JPG"],
  "Shakara X": ["X1.jpg", "Xold1.JPG", "Xold2.JPG", "Xold3.JPG", "Xold6.JPG"],
  "Shakara XX": ["xxold5.jpg", "XXold2.JPG", "XXold3.JPG"],
  "Clément": ["clement1.jpg", "Clem2.JPG", "Clem3.JPG", "clementold1.JPG", "clementold2.JPG"],
  "DIX": ["dix1.jpg"],
  "CIX": ["cix1.jpg"],
  "MD": ["md1.jpg"],
  "Magnifiscent": ["magnifiscent-alone.jpg", "Mag2.JPG", "Mag3.JPG"],
  "XXX": ["XXX4.jpg", "XXX2.jpg", "XXX3.jpg", "xxx1.jpg"],
};

const migrate = async () => {
  try {
    const products = await Product.find();

    for (const product of products) {
      let updated = false;

      if (imageMap[product.name]) {
        product.images = imageMap[product.name];
        product.image = undefined; // remove old field
        updated = true;
      }

      if (updated) {
        await product.save();
        console.log(`✅ Migrated product: ${product.name}`);
      } else {
        console.log(`ℹ️ Skipped product (no mapping): ${product.name}`);
      }
    }

    console.log("🎉 Migration complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Migration error:", err);
    process.exit(1);
  }
};

migrate();
