import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Resend Configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: Send Order Confirmation Email
const sendOrderConfirmation = async (order, userEmail) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API Key not set. Skipping email notification.');
    return;
  }

  const itemsList = order.items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('');

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: userEmail,
      subject: `Order Confirmed - #${order.orderId}`,
      html: `
        <div style="font-family: 'serif', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <h1 style="color: #d70150; text-align: center;">Order Confirmed!</h1>
          <p>Dear ${order.customerName},</p>
          <p>Your order <strong>#${order.orderId}</strong> has been placed successfully and is being prepared.</p>
          
          <div style="background-color: #fafafa; padding: 20px; border-radius: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Summary:</h3>
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="text-align: right; font-weight: bold; font-size: 1.2em;">Total: $${order.total.toFixed(2)}</p>
          </div>

          <p><strong>Delivery Address:</strong><br/>${order.deliveryAddress}</p>
          <p>Thank you for choosing Elysium Eats for your premium dining experience.</p>
          
          <div style="text-align: center; margin-top: 40px; color: #888; font-size: 0.8em;">
            <p>© 2026 Elysium Eats. All rights reserved.</p>
          </div>
        </div>
      `
    });

    if (error) {
      return console.error('Error sending email via Resend:', error);
    }
    console.log(`Confirmation email sent to ${userEmail} (ID: ${data.id})`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

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
  userId: String, // Changed from ObjectId to String for flexibility
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
    
    // Send confirmation email if email is provided
    const emailToNotify = req.body.userEmail;
    if (emailToNotify) {
      sendOrderConfirmation(savedOrder, emailToNotify);
    } else {
      // Fallback: try to find user by ID if email wasn't sent
      const user = await User.findById(req.body.userId).catch(() => null);
      if (user && user.email) {
        sendOrderConfirmation(savedOrder, user.email);
      }
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  // In a real app, you'd save this to a Newsletter collection
  console.log(`New newsletter subscription: ${email}`);
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const mailOptions = {
      from: `"Elysium Eats" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Elysium Eats Newsletter!',
      text: 'Thank you for subscribing to our newsletter! You will now receive updates on the finest dining experiences.'
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Newsletter email error:', err);
    }
  }

  res.status(200).json({ message: 'Subscribed successfully' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();
    res.status(201).json({ 
      message: 'User registered', 
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Dynamic Sitemap Generation ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://food-panda-restaurant.vercel.app';
    const restaurants = await Restaurant.find({}, 'name');
    
    // Mock blog IDs as they are defined in Pinia store but we need them for sitemap
    const blogIds = Array.from({ length: 100 }, (_, i) => i + 1);

    const staticPages = [
      '',
      '/blog',
      '/contact',
      '/terms',
      '/privacy',
      '/support'
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    staticPages.forEach(page => {
      sitemap += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Dynamic Restaurant pages
    restaurants.forEach(restaurant => {
      const restaurantSlug = encodeURIComponent(restaurant.name);
      sitemap += `  <url>\n    <loc>${baseUrl}/restaurant/${restaurantSlug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Dynamic Blog pages
    blogIds.forEach(id => {
      sitemap += `  <url>\n    <loc>${baseUrl}/blog/${id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
