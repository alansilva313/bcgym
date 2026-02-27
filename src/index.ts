import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import routes from './routes';
import './models';
import { seedExercises } from './utils/seed';
import { translateExistingExercises } from './utils/translate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

// Main route
app.get('/', (req, res) => {
    res.json({ message: 'Gym App API - Status: Active' });
});

// Database Sync
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database connected and synchronized.');
    await seedExercises(); // Seed the database
    await translateExistingExercises(); // Localize existing records
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error synchronizing database:', err);
});
