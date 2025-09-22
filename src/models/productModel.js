import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }], // ✅ array of image URLs for multiple photos
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Create model from schema
const Product = mongoose.model('Product', productSchema);

export default Product;
