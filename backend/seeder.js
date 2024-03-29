import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
// import hotels from './data/hotels.js';
import users from './data/users.js';
import { 
  connectDB,
  hotelModel as Hotel,
  userModel as User,
  orderModel as Order
} from './models/index.js';

const __dirname = path.resolve();
dotenv.config({ path: `${__dirname}/config.env` });
connectDB();

// Citire fisiere JSON
const hotels = JSON.parse(
  fs.readFileSync(`${__dirname}/backend/data/hotels.json`, 'utf-8')
);

const importData = async() => {
  try {
    await Hotel.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    
    // Incarca niste utilizatori in baza de date
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    
    // Seteaza un admin pentru fiecare hotel
    const sampleHotels = hotels.map(hotel => {
      return { ...hotel, user: adminUser}
    });

    await Hotel.create(sampleHotels);

    console.log('Data imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async() => {
  try {
    await Hotel.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}