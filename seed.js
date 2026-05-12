import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

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

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

const cuisineTemplates = {
  'Italian': {
    dishes: [
      { name: 'Margherita Pizza', basePrice: 15, images: ['https://images.unsplash.com/photo-1574071318508-1cdbcd80ad00'] },
      { name: 'Pasta Carbonara', basePrice: 18, images: ['https://images.unsplash.com/photo-1612874742237-6526221588e3'] },
      { name: 'Lasagna Bolognese', basePrice: 22, images: ['https://images.unsplash.com/photo-1574894709920-11b28e7367e3'] },
      { name: 'Truffle Mushroom Risotto', basePrice: 26, images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371'] },
      { name: 'Tiramisu', basePrice: 12, images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9'] }
    ],
    tags: ['Pasta', 'Pizza', 'Authentic', 'Comfort Food']
  },
  'Japanese': {
    dishes: [
      { name: 'Salmon Nigiri Set', basePrice: 24, images: ['https://images.unsplash.com/photo-1583623025817-d180a2221d0a'] },
      { name: 'Tonkotsu Ramen', basePrice: 19, images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624'] },
      { name: 'Dragon Roll', basePrice: 21, images: ['https://images.unsplash.com/photo-1559466273-d95e72debaf8'] },
      { name: 'Chicken Teriyaki', basePrice: 18, images: ['https://images.unsplash.com/photo-1532139154602-2727c51c412f'] },
      { name: 'Matcha Cheesecake', basePrice: 10, images: ['https://images.unsplash.com/photo-1536599424071-0b215a388ba7'] }
    ],
    tags: ['Sushi', 'Ramen', 'Healthy', 'Fresh']
  },
  'Indian': {
    dishes: [
      { name: 'Butter Chicken', basePrice: 20, images: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398'] },
      { name: 'Paneer Tikka Masala', basePrice: 18, images: ['https://images.unsplash.com/photo-1567184109411-47a7a3928501'] },
      { name: 'Lamb Biryani', basePrice: 22, images: ['https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8'] },
      { name: 'Garlic Naan', basePrice: 5, images: ['https://images.unsplash.com/photo-1601303584126-269425e6435c'] },
      { name: 'Gulab Jamun', basePrice: 8, images: ['https://images.unsplash.com/photo-1589113744320-990425007113'] }
    ],
    tags: ['Spicy', 'Curry', 'Vegetarian', 'Tandoori']
  },
  'American': {
    dishes: [
      { name: 'Signature Cheeseburger', basePrice: 16, images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd'] },
      { name: 'BBQ Pork Ribs', basePrice: 28, images: ['https://images.unsplash.com/photo-1544025162-d76694265947'] },
      { name: 'Crispy Chicken Wings', basePrice: 14, images: ['https://images.unsplash.com/photo-1567620832903-9fc6debc209f'] },
      { name: 'Mac & Cheese', basePrice: 12, images: ['https://images.unsplash.com/photo-1543339308-43e59d6b73a6'] },
      { name: 'Chocolate Brownie', basePrice: 9, images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c'] }
    ],
    tags: ['Burger', 'BBQ', 'Fast Food', 'Wings']
  },
  'Healthy': {
    dishes: [
      { name: 'Quinoa Buddha Bowl', basePrice: 17, images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd'] },
      { name: 'Grilled Salmon Salad', basePrice: 21, images: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288'] },
      { name: 'Avocado Toast', basePrice: 14, images: ['https://images.unsplash.com/photo-1525351484163-7529414344d8'] },
      { name: 'Açaí Berry Bowl', basePrice: 13, images: ['https://images.unsplash.com/photo-1590301157890-4810ed352733'] },
      { name: 'Green Detox Smoothie', basePrice: 9, images: ['https://images.unsplash.com/photo-1610970881699-44a5587cabec'] }
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

const generateData = () => {
  const restaurants = [];
  let dishIdCounter = 1000;
  let totalDishes = 0;
  const targetDishes = 400;

  for (let i = 0; i < restaurantNames.length; i++) {
    const cuisineTypes = Object.keys(cuisineTemplates);
    const cuisine = cuisineTypes[i % cuisineTypes.length];
    const template = cuisineTemplates[cuisine];

    const restaurant = {
      id: i + 1,
      name: restaurantNames[i],
      cuisine: cuisine,
      rating: (4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 1000) + 50,
      deliveryTime: `${15 + Math.floor(Math.random() * 30)}-${25 + Math.floor(Math.random() * 30)} min`,
      minOrder: 15 + Math.floor(Math.random() * 20),
      deliveryFee: (Math.random() * 5).toFixed(2),
      image: template.dishes[0].images[0] + '?auto=format&fit=crop&q=80&w=800',
      featured: Math.random() > 0.7,
      promo: Math.random() > 0.5 ? `${Math.floor(Math.random() * 30) + 10}% OFF` : '',
      tags: template.tags,
      menu: []
    };

    // Each restaurant gets ~20 dishes to reach 400 total
    const numDishes = 20;
    for (let j = 0; j < numDishes; j++) {
      const baseDish = template.dishes[j % template.dishes.length];
      restaurant.menu.push({
        id: dishIdCounter++,
        name: `${baseDish.name} ${j > 4 ? `(Style ${j - 3})` : ''}`.trim(),
        description: `Our signature ${baseDish.name.toLowerCase()} prepared with the freshest ingredients and traditional techniques.`,
        price: (baseDish.basePrice + Math.random() * 5).toFixed(2),
        image: baseDish.images[0] + `?auto=format&fit=crop&q=80&w=400&sig=${dishIdCounter}`,
        popular: Math.random() > 0.6
      });
      totalDishes++;
    }
    restaurants.push(restaurant);
  }

  // Ensure we have exactly 400 if needed, but 20 * 20 = 400 exactly.
  console.log(`Generated ${restaurants.length} restaurants with a total of ${totalDishes} dishes.`);
  return restaurants;
};

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing existing data...');
    await Restaurant.deleteMany({});
    
    const data = generateData();
    console.log('Inserting new data...');
    await Restaurant.insertMany(data);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
