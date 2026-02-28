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

// Maintenance: Force DB Sync (Admin only via SYNC_TOKEN)
app.get('/api/admin/sync', async (req, res) => {
    const token = req.query.token;
    if (!process.env.SYNC_TOKEN || token !== process.env.SYNC_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        await sequelize.sync({ alter: true });
        res.json({ message: 'Database synchronized successfully with alter:true' });
    } catch (error: any) {
        res.status(500).json({ error: 'Sync failed', message: error.message });
    }
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('--- GLOBAL ERROR HANDLER ---');
    console.error('Error Stack:', err.stack);
    console.error('Error Message:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Main route
app.get('/', (req, res) => {
    res.json({ message: 'Gym App API - Status: Active' });
});

// Start listening and syncing
const shouldSync = process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_SYNC === 'true';

if (shouldSync && !process.env.VERCEL) {
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
}

export default app;
