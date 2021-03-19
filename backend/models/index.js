import mongoose from 'mongoose';
import hotelModel from './hotelModel.js';

mongoose.set('debug', true);

const connectDB = async() => {
  try {
    const dbURL = process.env.MONGO_URI || 'mongodb://localhost/luke-travel';
    const conn = await mongoose.connect(dbURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export { 
  connectDB,
  hotelModel 
};