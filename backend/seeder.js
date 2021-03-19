import mongoose from 'mongoose';
import colors from 'colors';
import hotels from './data/hotels.js';
import { 
  connectDB,
  hotelModel as Hotel  
} from './models/index.js';

connectDB();

const importData = async() => {
  try {
    await Hotel.deleteMany();
    await Hotel.insertMany(hotels);

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