import { Request, Response } from 'express';
import { Workout } from '../models/Workout';
import { Exercise } from '../models/Exercise';
import { WorkoutExercise } from '../models/WorkoutExercise';

export const createWorkout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { name, goal, daysOfWeek, exercises } = req.body;

        const workout = await Workout.create({
            userId,
            name,
            goal,
            daysOfWeek
        });

        if (exercises && Array.isArray(exercises)) {
            for (const item of exercises) {
                await WorkoutExercise.create({
                    workoutId: workout.id,
                    exerciseId: item.exerciseId,
                    sets: item.sets,
                    reps: item.reps,
                    rest_time: item.rest_time
                });
            }
        }

        res.status(201).json(workout);
    } catch (error) {
        console.error('Workout creation error:', error);
        res.status(500).json({ error: 'Failed to create workout routine' });
    }
};

export const getMyWorkouts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const workouts = await Workout.findAll({
            where: { userId },
            include: [{ model: Exercise, as: 'exercises' }]
        });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
};

export const getWorkoutById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        if (!id || id === 'null' || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid workout ID' });
        }

        const workout = await Workout.findOne({
            where: { id: Number(id), userId },
            include: [
                {
                    model: WorkoutExercise,
                    as: 'workoutExercises',
                    include: [{ model: Exercise, as: 'exercise' }]
                }
            ]
        });
        if (!workout) return res.status(404).json({ error: 'Workout not found' });
        res.json(workout);
    } catch (error) {
        console.error('getWorkoutById error:', error);
        res.status(500).json({ error: 'Failed to fetch workout' });
    }
};

export const updateWorkout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { name, daysOfWeek, exercises } = req.body;

        const workout = await Workout.findOne({ where: { id, userId } });
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        await workout.update({ name, daysOfWeek });

        if (exercises && Array.isArray(exercises)) {
            // Remove old exercises and recreate
            await WorkoutExercise.destroy({ where: { workoutId: id } });
            for (const item of exercises) {
                await WorkoutExercise.create({
                    workoutId: workout.id,
                    exerciseId: item.exerciseId,
                    sets: item.sets,
                    reps: item.reps,
                    rest_time: item.rest_time || '60s',
                });
            }
        }

        res.json({ message: 'Workout updated', workout });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
};

export const deleteWorkout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const workout = await Workout.findOne({ where: { id, userId } });
        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        // WorkoutExercise should be automatically cascading if set correctly, or delete manual
        await WorkoutExercise.destroy({ where: { workoutId: id } });
        await workout.destroy();

        res.json({ message: 'Workout deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting workout' });
    }
};
