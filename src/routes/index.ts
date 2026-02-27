import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
import * as ExerciseController from '../controllers/ExerciseController';
import * as WorkoutController from '../controllers/WorkoutController';
import * as WorkoutSessionController from '../controllers/WorkoutSessionController';
import { HydrationController } from '../controllers/HydrationController';
import { MeasurementController } from '../controllers/MeasurementController';
import * as UserController from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/google', AuthController.googleLogin);
router.get('/auth/me', authMiddleware, AuthController.getMe);
router.put('/auth/me', authMiddleware, AuthController.updateMe);

// Exercises
router.get('/exercises', ExerciseController.getAllExercises);
router.post('/exercises', ExerciseController.createExercise);
router.get('/exercises/:id', ExerciseController.getExerciseById);
router.put('/exercises/:id', ExerciseController.updateExercise);
router.delete('/exercises/:id', ExerciseController.deleteExercise);

// Workouts
router.post('/workouts', authMiddleware, WorkoutController.createWorkout);
router.get('/workouts', authMiddleware, WorkoutController.getMyWorkouts);
router.get('/workouts/:id', authMiddleware, WorkoutController.getWorkoutById);
router.put('/workouts/:id', authMiddleware, WorkoutController.updateWorkout);
router.delete('/workouts/:id', authMiddleware, WorkoutController.deleteWorkout);

// Workout Sessions (history + stats)
router.post('/workout-sessions', authMiddleware, WorkoutSessionController.createSession);
router.get('/workout-sessions', authMiddleware, WorkoutSessionController.getMySessions);
router.get('/workout-sessions/stats/summary', authMiddleware, WorkoutSessionController.getStatsSummary);
router.get('/workout-sessions/:id', authMiddleware, WorkoutSessionController.getSessionById);

// Hydration
router.post('/hydration', authMiddleware, HydrationController.addWater);
router.get('/hydration/today', authMiddleware, HydrationController.getToday);
router.get('/hydration/month', authMiddleware, HydrationController.getMonth);

// Measurements
router.post('/measurements', authMiddleware, MeasurementController.create);
router.get('/measurements', authMiddleware, MeasurementController.getAll);
router.get('/measurements/latest', authMiddleware, MeasurementController.getLatest);

// Users
router.get('/users', UserController.getAllUsers);
router.delete('/users/:id', UserController.deleteUser);

// Upload
router.post('/upload', upload.single('gif'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
});

export default router;
