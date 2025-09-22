import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../src/models/productModel.js';

const router = express.Router();

// 🔹 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer-Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const upload = multer({ storage });

/* ===========================
   PRODUCT ROUTES
=========================== */

// ✅ GET /api/products — get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('❌ Fetch products error:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ✅ GET /api/products/:id — get a single product by ID
// Example in productRoutes.js
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ normalize images
    const normalized = {
      ...product.toObject(),
      images: Array.isArray(product.images)
        ? product.images
        : product.images
        ? [product.images]
        : [],
    };

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/products — create product with multiple images
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const imageUrls = req.files.map(file => file.path); // Cloudinary gives us `path`

    const product = new Product({
      name,
      description,
      price,
      images: imageUrls, // store array
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Create product error:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// ✅ PUT /api/products/:id — update product and add new images
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    // append new images if uploaded
    if (req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      product.images.push(...imageUrls);
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('❌ Update product error:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

export default router;
