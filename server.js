import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Models ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  favorites: {
    restaurants: [Number],
    items: [Number]
  },
  createdAt: { type: Date, default: Date.now }
});

const RestaurantSchema = new mongoose.Schema({
  id: Number,
  name: String,
  cuisine: String,
  rating: Number,
  reviewCount: Number,
  deliveryTime: String,
  minOrder: Number,
  deliveryFee: Number,
  image: String,
  featured: Boolean,
  promo: String,
  tags: [String],
  menu: [{
    id: Number,
    name: String,
    description: String,
    price: Number,
    image: String,
    popular: Boolean
  }]
});

const OrderSchema = new mongoose.Schema({
  orderId: String,
  userId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  items: Array,
  total: Number,
  subtotal: Number,
  deliveryFee: Number,
  deliveryAddress: String,
  status: { type: String, default: 'confirmed' },
  paymentMethod: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Order = mongoose.model('Order', OrderSchema);

// --- Routes ---

app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered', user: { name, email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
