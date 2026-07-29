import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import dns from 'dns';
dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isMongoConnected = false;
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('Connected to MongoDB Atlas');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err.message);
    });
} else {
  console.warn('MONGO_URI is missing in .env. Running backend in fallback/mock mode.');
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-key';

const adminAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Resend Configuration
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper: Send Order Confirmation Email
const sendOrderConfirmation = async (order, userEmail) => {
  console.log(`Attempting to send email to: ${userEmail}`);
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API Key not set. Skipping email notification.');
    return;
  }

  const itemsList = order.items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('');

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL;
    console.log(`Sending from: ${fromEmail}`);
    
    // Recipients list: user + admin (if configured)
    const recipients = [userEmail];
    if (adminEmail) recipients.push(adminEmail);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `New Order Received - #${order.orderId}`,
      html: `
        <div style="font-family: 'serif', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <h1 style="color: #d70150; text-align: center;">New Order!</h1>
          <p>A new order <strong>#${order.orderId}</strong> has been placed.</p>
          
          <div style="background-color: #fafafa; padding: 20px; border-radius: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <ul style="list-style: none; padding: 0;">
              ${itemsList}
            </ul>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="text-align: right; font-weight: bold; font-size: 1.2em;">Total: $${order.total.toFixed(2)}</p>
          </div>

          <p><strong>Delivery Address:</strong><br/>${order.deliveryAddress}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
          
          <div style="text-align: center; margin-top: 40px; color: #888; font-size: 0.8em;">
            <p>© 2026 Elysium Eats. Order Management System.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Resend Error Details:', error);
      return;
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

const cuisineTemplates = {
  'Italian': {
    dishes: [
      { name: 'Margherita Pizza', basePrice: 15, image: 'https://images.unsplash.com/photo-1574071318508-1cdbcd80ad00' },
      { name: 'Pasta Carbonara', basePrice: 18, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3' },
      { name: 'Lasagna Bolognese', basePrice: 22, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3' },
      { name: 'Truffle Mushroom Risotto', basePrice: 26, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371' },
      { name: 'Tiramisu', basePrice: 12, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' }
    ],
    tags: ['Pasta', 'Pizza', 'Authentic', 'Comfort Food']
  },
  'Japanese': {
    dishes: [
      { name: 'Salmon Nigiri Set', basePrice: 24, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a' },
      { name: 'Tonkotsu Ramen', basePrice: 19, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624' },
      { name: 'Dragon Roll', basePrice: 21, image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8' },
      { name: 'Chicken Teriyaki', basePrice: 18, image: 'https://images.unsplash.com/photo-1532139154602-2727c51c412f' },
      { name: 'Matcha Cheesecake', basePrice: 10, image: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7' }
    ],
    tags: ['Sushi', 'Ramen', 'Healthy', 'Fresh']
  },
  'Indian': {
    dishes: [
      { name: 'Butter Chicken', basePrice: 20, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398' },
      { name: 'Paneer Tikka Masala', basePrice: 18, image: 'https://images.unsplash.com/photo-1567184109411-47a7a3928501' },
      { name: 'Lamb Biryani', basePrice: 22, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8' },
      { name: 'Garlic Naan', basePrice: 5, image: 'https://images.unsplash.com/photo-1601303584126-269425e6435c' },
      { name: 'Gulab Jamun', basePrice: 8, image: 'https://images.unsplash.com/photo-1589113744320-990425007113' }
    ],
    tags: ['Spicy', 'Curry', 'Vegetarian', 'Tandoori']
  },
  'American': {
    dishes: [
      { name: 'Signature Cheeseburger', basePrice: 16, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
      { name: 'BBQ Pork Ribs', basePrice: 28, image: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
      { name: 'Crispy Chicken Wings', basePrice: 14, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f' },
      { name: 'Mac & Cheese', basePrice: 12, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6' },
      { name: 'Chocolate Brownie', basePrice: 9, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c' }
    ],
    tags: ['Burger', 'BBQ', 'Fast Food', 'Wings']
  },
  'Healthy': {
    dishes: [
      { name: 'Quinoa Buddha Bowl', basePrice: 17, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
      { name: 'Grilled Salmon Salad', basePrice: 21, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288' },
      { name: 'Avocado Toast', basePrice: 14, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8' },
      { name: 'Açaí Berry Bowl', basePrice: 13, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' },
      { name: 'Green Detox Smoothie', basePrice: 9, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec' }
    ],
    tags: ['Vegan', 'Gluten-Free', 'Organic', 'Salads']
  }
};

const restaurantNames = [
  'The Golden Truffle', 'Zen Garden', 'Spice Route', 'Burger Theory', 'Green Leaf',
  'Luigi\'s Kitchen', 'Tokyo Express', 'Mumbai Magic', 'Steak & Co', 'Purely Plant',
  'Ocean Breeze', 'Alpine Bistro', 'Saffron Sky', 'Urban Grill', 'The Healthy Hub',
  'Mama Mia', 'Sakura Sushi', 'Indi-Go', 'Crispy Corner', 'Vitality Veg'
];

function generateMockRestaurants() {
  const restaurants = [];
  let dishIdCounter = 1000;
  for (let i = 0; i < restaurantNames.length; i++) {
    const cuisineTypes = Object.keys(cuisineTemplates);
    const cuisine = cuisineTypes[i % cuisineTypes.length];
    const template = cuisineTemplates[cuisine];

    const restaurant = {
      id: i + 1,
      name: restaurantNames[i],
      cuisine: cuisine,
      rating: parseFloat((4 + (i % 10) * 0.1).toFixed(1)),
      reviewCount: 150 + i * 25,
      deliveryTime: `${20 + (i % 4) * 5}-${30 + (i % 4) * 5} min`,
      minOrder: 15,
      deliveryFee: parseFloat((2.99 + (i % 3)).toFixed(2)),
      image: template.dishes[0].image + '?auto=format&fit=crop&q=80&w=800',
      featured: i % 3 === 0,
      promo: i % 2 === 0 ? '20% OFF' : '',
      tags: template.tags,
      menu: []
    };

    for (let j = 0; j < 20; j++) {
      const baseDish = template.dishes[j % template.dishes.length];
      restaurant.menu.push({
        id: dishIdCounter++,
        name: `${baseDish.name}${j >= 5 ? ` Special ${j - 4}` : ''}`,
        description: `Signature ${baseDish.name.toLowerCase()} crafted with premium ingredients and chef special seasoning.`,
        price: parseFloat((baseDish.basePrice + (j % 5) * 1.5).toFixed(2)),
        image: baseDish.image + `?auto=format&fit=crop&q=80&w=400&sig=${dishIdCounter}`,
        popular: j % 3 === 0
      });
    }
    restaurants.push(restaurant);
  }
  return restaurants;
}

const fallbackRestaurants = generateMockRestaurants();
// Mutable in-memory copy so admin CRUD works without MongoDB
let mutableData = null;
const getData = () => {
  if (mongoose.connection.readyState === 1) return null; // use DB
  if (!mutableData) mutableData = JSON.parse(JSON.stringify(fallbackRestaurants));
  return mutableData;
};

// --- Routes ---

app.get('/api/restaurants', async (req, res) => {
  try {
    let restaurants = [];
    if (mongoose.connection.readyState === 1) {
      restaurants = await Restaurant.find();
    }
    if (!restaurants || restaurants.length === 0) {
      restaurants = getData() || fallbackRestaurants;
    }
    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants from DB, sending fallback data:', err.message);
    res.json(getData() || fallbackRestaurants);
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let restaurant = null;
    if (mongoose.connection.readyState === 1) {
      restaurant = await Restaurant.findOne({ id });
    }
    if (!restaurant) {
      const data = getData() || fallbackRestaurants;
      restaurant = data.find(r => r.id === id);
    }
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    const id = parseInt(req.params.id);
    const data = getData() || fallbackRestaurants;
    const restaurant = data.find(r => r.id === id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(500).json({ message: err.message });
    }
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
  
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to Elysium Eats Newsletter!',
        html: `
          <div style="font-family: 'serif', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
            <h1 style="color: #d70150; text-align: center;">Welcome!</h1>
            <p>Thank you for subscribing to the <strong>Elysium Eats</strong> newsletter.</p>
            <p>You will now receive updates on the finest dining experiences and exclusive offers.</p>
            <div style="text-align: center; margin-top: 40px; color: #888; font-size: 0.8em;">
              <p>© 2026 Elysium Eats. All rights reserved.</p>
            </div>
          </div>
        `
      });
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

// --- Admin Auth ---
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elysiumeats.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email, name: 'Admin', role: 'admin' } });
});

// Helper: get restaurant data source (DB or mutable memory)
const getRestaurantsSource = async () => {
  if (mongoose.connection.readyState === 1) {
    return { type: 'db', data: null };
  }
  return { type: 'memory', data: getData() };
};

// Helper: save restaurant data back after mutation (memory only)
const persistRestaurants = async (type, data) => {
  if (type === 'db') return; // already saved via mongoose
  // in-memory: data is already mutated in getData() reference
};

// --- Admin CRUD: Restaurants ---
app.get('/api/admin/restaurants', adminAuth, async (req, res) => {
  try {
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const restaurants = await Restaurant.find();
      return res.json(restaurants);
    }
    res.json(source.data);
  } catch (err) {
    res.json(getData());
  }
});

app.post('/api/admin/restaurants', adminAuth, async (req, res) => {
  try {
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const data = req.body;
      const maxRestaurant = await Restaurant.findOne().sort('-id');
      data.id = (maxRestaurant?.id || 0) + 1;
      const restaurant = new Restaurant(data);
      const saved = await restaurant.save();
      return res.status(201).json(saved);
    }
    // In-memory
    const data = source.data;
    const maxId = data.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const newRest = { id: maxId + 1, menu: [], ...req.body };
    data.push(newRest);
    return res.status(201).json(newRest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/admin/restaurants/:id', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const updated = await Restaurant.findOneAndUpdate({ id }, req.body, { new: true });
      if (updated) return res.json(updated);
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const idx = source.data.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Restaurant not found' });
    Object.assign(source.data[idx], req.body);
    return res.json(source.data[idx]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/admin/restaurants/:id', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      await Restaurant.findOneAndDelete({ id });
      return res.json({ message: 'Deleted' });
    }
    const idx = source.data.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Restaurant not found' });
    source.data.splice(idx, 1);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Admin CRUD: Menu Items ---
app.post('/api/admin/restaurants/:id/menu', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const restaurant = await Restaurant.findOne({ id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const maxId = restaurant.menu.reduce((max, item) => Math.max(max, item.id || 0), 999);
      const newItem = { id: maxId + 1, ...req.body };
      restaurant.menu.push(newItem);
      await restaurant.save();
      return res.status(201).json(newItem);
    }
    const restaurant = source.data.find(r => r.id === id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const maxId = restaurant.menu.reduce((max, item) => Math.max(max, item.id || 0), 999);
    const newItem = { id: maxId + 1, ...req.body };
    restaurant.menu.push(newItem);
    return res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/admin/restaurants/:id/menu/:itemId', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemId = parseInt(req.params.itemId);
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const restaurant = await Restaurant.findOne({ id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      const idx = restaurant.menu.findIndex(m => m.id === itemId);
      if (idx === -1) return res.status(404).json({ message: 'Menu item not found' });
      Object.assign(restaurant.menu[idx], req.body);
      await restaurant.save();
      return res.json(restaurant.menu[idx]);
    }
    const restaurant = source.data.find(r => r.id === id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const idx = restaurant.menu.findIndex(m => m.id === itemId);
    if (idx === -1) return res.status(404).json({ message: 'Menu item not found' });
    Object.assign(restaurant.menu[idx], req.body);
    return res.json(restaurant.menu[idx]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/admin/restaurants/:id/menu/:itemId', adminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemId = parseInt(req.params.itemId);
    const source = await getRestaurantsSource();
    if (source.type === 'db') {
      const restaurant = await Restaurant.findOne({ id });
      if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
      restaurant.menu = restaurant.menu.filter(m => m.id !== itemId);
      await restaurant.save();
      return res.json({ message: 'Deleted' });
    }
    const restaurant = source.data.find(r => r.id === id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.menu = restaurant.menu.filter(m => m.id !== itemId);
    return res.json({ message: 'Deleted' });
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
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
