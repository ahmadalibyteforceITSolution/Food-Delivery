import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://ahmedalihafeez25_db_user:%40Sublime12345@cluster0.oe0inne.mongodb.net/food-delivery?retryWrites=true&w=majority';

console.log('Testing with Google DNS (8.8.8.8)...');
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('SUCCESSFULLY CONNECTED TO MONGODB ATLAS WITH GOOGLE DNS!');
  await mongoose.disconnect();
} catch (err) {
  console.error('Connection failed:', err);
}
