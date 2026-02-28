import { Request, Response } from 'express';
import { User } from '../models/User';
import { Workout } from '../models/Workout';
import { WorkoutExercise } from '../models/WorkoutExercise';
import { Exercise } from '../models/Exercise';

export const linkStudent = async (req: Request, res: Response) => {
    try {
        const trainerId = (req as any).userId;
        const { pairingCode } = req.body;

        const trainer = await User.findByPk(trainerId);
        if (!trainer || (trainer.role !== 'trainer' && trainer.role !== 'admin')) {
            return res.status(403).json({ error: 'Apenas personal trainers podem vincular alunos.' });
        }

        const student = await User.findOne({ where: { pairingCode } });
        if (!student) {
            return res.status(404).json({ error: 'Código de pareamento inválido ou aluno não encontrado.' });
        }

        if (student.trainerId) {
            return res.status(400).json({ error: 'Este aluno já possui um personal trainer vinculado.' });
        }

        await student.update({ trainerId });

        res.json({ message: 'Aluno vinculado com sucesso!', student: { name: student.name, email: student.email } });
    } catch (error) {
        console.error('Link student error:', error);
        res.status(500).json({ error: 'Falha ao vincular aluno.' });
    }
};

export const getMyStudents = async (req: Request, res: Response) => {
    try {
        const trainerId = (req as any).userId;
        const students = await User.findAll({
            where: { trainerId },
            attributes: ['id', 'name', 'email', 'goal', 'weight', 'height', 'level', 'xp']
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};

export const getStudentWorkout = async (req: Request, res: Response) => {
    try {
        const trainerId = (req as any).userId;
        const { studentId } = req.params;

        const student = await User.findOne({ where: { id: studentId, trainerId } });
        if (!student) return res.status(403).json({ error: 'Acesso negado a este aluno.' });

        const workouts = await Workout.findAll({
            where: { userId: studentId },
            include: [{
                model: WorkoutExercise,
                as: 'workoutExercises',
                include: [{ model: Exercise, as: 'exercise' }]
            }]
        });

        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar treinos do aluno.' });
    }
};

export const assignWorkoutToStudent = async (req: Request, res: Response) => {
    try {
        const trainerId = (req as any).userId;
        const { studentId } = req.params;
        const { name, goal, daysOfWeek, exercises } = req.body;

        const student = await User.findOne({ where: { id: studentId, trainerId } });
        if (!student) return res.status(403).json({ error: 'Acesso negado ou aluno não vinculado.' });

        const workout = await Workout.create({
            userId: Number(studentId),
            trainerId,
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
                    load: item.load || '0',
                    rest_time: item.rest_time || '60s'
                });
            }
        }

        res.status(201).json(workout);
    } catch (error) {
        console.error('Assign workout error:', error);
        res.status(500).json({ error: 'Falha ao atribuir treino ao aluno.' });
    }
};

export const unlinkTrainer = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).userId;
        const student = await User.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (!student.trainerId) {
            return res.status(400).json({ error: 'Você não possui um personal trainer vinculado.' });
        }

        await student.update({ trainerId: null });

        res.json({ message: 'Personal desvinculado com sucesso!' });
    } catch (error) {
        console.error('Unlink trainer error:', error);
        res.status(500).json({ error: 'Falha ao desvincular personal.' });
    }
};
