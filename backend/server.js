import express from 'express';
import colors from 'colors';
import { connectDB } from './models/index.js';

import hotelRoutes from './routes/hotelRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use('/api/hotels', hotelRoutes);

app.get('/', (req, res) => res.json('LukeTravel API is running...'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});