import express from 'express';


import hotelRoutes from './routes/hotelRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/hotels', hotelRoutes);

app.get('/', (req, res) => res.json({ message: 'hello from the other side'}));

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});