import mongoose from 'mongoose';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const uri = 'mongodb+srv://ahmedalihafeez25_db_user:%40Sublime12345@cluster0.oe0inne.mongodb.net/food-delivery?retryWrites=true&w=majority';

console.log('Connecting to:', uri);
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('SUCCESSFULLY CONNECTED TO MONGODB ATLAS!');
  await mongoose.disconnect();
} catch (err) {
  console.error('Connection failed:', err);
}
