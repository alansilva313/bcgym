import { Request, Response } from 'express';
import { Exercise } from '../models/Exercise';
import { Op } from 'sequelize';

export const getAllExercises = async (req: Request, res: Response) => {
    try {
        const { muscle_group, level, type } = req.query;

        const filters: any = {};
        if (muscle_group) filters.muscle_group = muscle_group;
        if (level) filters.level = level;
        if (type) filters.type = type;

        const exercises = await Exercise.findAll({ where: filters });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar exercícios' });
    }
};

export const createExercise = async (req: Request, res: Response) => {
    try {
        const { name, muscle_group, level, equipment, description, gif_url, type } = req.body;

        const exercise = await Exercise.create({
            name,
            muscle_group,
            level,
            equipment,
            description,
            gif_url,
            type
        });

        res.status(201).json(exercise);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao criar exercício' });
    }
};

export const getExerciseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findByPk(Number(id));
        if (!exercise) return res.status(404).json({ error: 'Exercício não encontrado' });
        res.json(exercise);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar exercício' });
    }
};

export const updateExercise = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, muscle_group, level, equipment, description, gif_url, type } = req.body;

        const exercise = await Exercise.findByPk(Number(id));
        if (!exercise) return res.status(404).json({ error: 'Exercício não encontrado' });

        await exercise.update({
            name,
            muscle_group,
            level,
            equipment,
            description,
            gif_url,
            type
        });

        res.json(exercise);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao atualizar exercício' });
    }
};

export const deleteExercise = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const exercise = await Exercise.findByPk(Number(id));
        if (!exercise) return res.status(404).json({ error: 'Exercício não encontrado' });

        await exercise.destroy();
        res.json({ message: 'Exercício excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao excluir exercício' });
    }
};
