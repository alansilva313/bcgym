"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController = __importStar(require("../controllers/AuthController"));
const ExerciseController = __importStar(require("../controllers/ExerciseController"));
const WorkoutController = __importStar(require("../controllers/WorkoutController"));
const WorkoutSessionController = __importStar(require("../controllers/WorkoutSessionController"));
const HydrationController_1 = require("../controllers/HydrationController");
const MeasurementController_1 = require("../controllers/MeasurementController");
const UserController = __importStar(require("../controllers/UserController"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/google', AuthController.googleLogin);
router.get('/auth/me', auth_1.authMiddleware, AuthController.getMe);
router.put('/auth/me', auth_1.authMiddleware, AuthController.updateMe);
// Exercises
router.get('/exercises', ExerciseController.getAllExercises);
router.post('/exercises', ExerciseController.createExercise);
router.get('/exercises/:id', ExerciseController.getExerciseById);
router.put('/exercises/:id', ExerciseController.updateExercise);
router.delete('/exercises/:id', ExerciseController.deleteExercise);
// Workouts
router.post('/workouts', auth_1.authMiddleware, WorkoutController.createWorkout);
router.get('/workouts', auth_1.authMiddleware, WorkoutController.getMyWorkouts);
router.get('/workouts/:id', auth_1.authMiddleware, WorkoutController.getWorkoutById);
router.put('/workouts/:id', auth_1.authMiddleware, WorkoutController.updateWorkout);
router.delete('/workouts/:id', auth_1.authMiddleware, WorkoutController.deleteWorkout);
// Workout Sessions (history + stats)
router.post('/workout-sessions', auth_1.authMiddleware, WorkoutSessionController.createSession);
router.get('/workout-sessions', auth_1.authMiddleware, WorkoutSessionController.getMySessions);
router.get('/workout-sessions/stats/summary', auth_1.authMiddleware, WorkoutSessionController.getStatsSummary);
router.get('/workout-sessions/:id', auth_1.authMiddleware, WorkoutSessionController.getSessionById);
// Hydration
router.post('/hydration', auth_1.authMiddleware, HydrationController_1.HydrationController.addWater);
router.get('/hydration/today', auth_1.authMiddleware, HydrationController_1.HydrationController.getToday);
router.get('/hydration/month', auth_1.authMiddleware, HydrationController_1.HydrationController.getMonth);
// Measurements
router.post('/measurements', auth_1.authMiddleware, MeasurementController_1.MeasurementController.create);
router.get('/measurements', auth_1.authMiddleware, MeasurementController_1.MeasurementController.getAll);
router.get('/measurements/latest', auth_1.authMiddleware, MeasurementController_1.MeasurementController.getLatest);
// Users
router.get('/users', UserController.getAllUsers);
router.delete('/users/:id', UserController.deleteUser);
// Upload
router.post('/upload', upload_1.upload.single('gif'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
});
exports.default = router;
