"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkout = exports.updateWorkout = exports.getWorkoutById = exports.getMyWorkouts = exports.createWorkout = void 0;
const Workout_1 = require("../models/Workout");
const Exercise_1 = require("../models/Exercise");
const WorkoutExercise_1 = require("../models/WorkoutExercise");
const createWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, goal, daysOfWeek, exercises } = req.body;
        const workout = yield Workout_1.Workout.create({
            userId,
            name,
            goal,
            daysOfWeek
        });
        if (exercises && Array.isArray(exercises)) {
            for (const item of exercises) {
                yield WorkoutExercise_1.WorkoutExercise.create({
                    workoutId: workout.id,
                    exerciseId: item.exerciseId,
                    sets: item.sets,
                    reps: item.reps,
                    rest_time: item.rest_time
                });
            }
        }
        res.status(201).json(workout);
    }
    catch (error) {
        console.error('Workout creation error:', error);
        res.status(500).json({ error: 'Failed to create workout routine' });
    }
});
exports.createWorkout = createWorkout;
const getMyWorkouts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const workouts = yield Workout_1.Workout.findAll({
            where: { userId },
            include: [{ model: Exercise_1.Exercise, as: 'exercises' }]
        });
        res.json(workouts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});
exports.getMyWorkouts = getMyWorkouts;
const getWorkoutById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const workout = yield Workout_1.Workout.findOne({
            where: { id, userId },
            include: [
                {
                    model: WorkoutExercise_1.WorkoutExercise,
                    as: 'workoutExercises',
                    include: [{ model: Exercise_1.Exercise, as: 'exercise' }]
                }
            ]
        });
        if (!workout)
            return res.status(404).json({ error: 'Workout not found' });
        res.json(workout);
    }
    catch (error) {
        console.error('getWorkoutById error:', error);
        res.status(500).json({ error: 'Failed to fetch workout' });
    }
});
exports.getWorkoutById = getWorkoutById;
const updateWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { name, daysOfWeek, exercises } = req.body;
        const workout = yield Workout_1.Workout.findOne({ where: { id, userId } });
        if (!workout)
            return res.status(404).json({ error: 'Workout not found' });
        yield workout.update({ name, daysOfWeek });
        if (exercises && Array.isArray(exercises)) {
            // Remove old exercises and recreate
            yield WorkoutExercise_1.WorkoutExercise.destroy({ where: { workoutId: id } });
            for (const item of exercises) {
                yield WorkoutExercise_1.WorkoutExercise.create({
                    workoutId: workout.id,
                    exerciseId: item.exerciseId,
                    sets: item.sets,
                    reps: item.reps,
                    rest_time: item.rest_time || '60s',
                });
            }
        }
        res.json({ message: 'Workout updated', workout });
    }
    catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});
exports.updateWorkout = updateWorkout;
const deleteWorkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const workout = yield Workout_1.Workout.findOne({ where: { id, userId } });
        if (!workout)
            return res.status(404).json({ error: 'Workout not found' });
        // WorkoutExercise should be automatically cascading if set correctly, or delete manual
        yield WorkoutExercise_1.WorkoutExercise.destroy({ where: { workoutId: id } });
        yield workout.destroy();
        res.json({ message: 'Workout deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting workout' });
    }
});
exports.deleteWorkout = deleteWorkout;
