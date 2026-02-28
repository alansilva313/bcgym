import { Request, Response } from 'express';
import { WorkoutSession } from '../models/WorkoutSession';
import { Op } from 'sequelize';

/** POST /workout-sessions — start or save a session */
export const createSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            workoutId,
            workoutName,
            totalTimeSeconds = 0,
            totalSetsCompleted = 0,
            totalExercises = 0,
            avgRestTimeTaken = 0,
            avgTimeBetweenSets = 0,
            exerciseLogs = [],
            totalVolumeKg = 0,
            status = 'active'
        } = req.body;

        const session = await WorkoutSession.create({
            userId,
            workoutId,
            workoutName,
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            totalVolumeKg,
            avgRestTimeTaken,
            avgTimeBetweenSets,
            exerciseLogs: JSON.stringify(exerciseLogs),
            status,
            completedAt: status === 'completed' ? new Date() : null,
        });

        res.status(201).json({ message: 'Sessão iniciada', session });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to start session' });
    }
};

/** GET /workout-sessions — get user's sessions (most recent first) */
export const getMySessions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const limit = parseInt(req.query.limit as string) || 20;

        const sessions = await WorkoutSession.findAll({
            where: { userId },
            order: [['completedAt', 'DESC']],
            limit,
        });

        // Parse exerciseLogs JSON for each session
        const parsed = sessions.map(s => ({
            ...s.toJSON(),
            exerciseLogs: (() => {
                try { return JSON.parse(s.exerciseLogs); }
                catch { return []; }
            })(),
        }));

        res.json(parsed);
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to get sessions' });
    }
};

/** GET /workout-sessions/:id — get a single session detail */
export const getSessionById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        const session = await WorkoutSession.findOne({ where: { id, userId } });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        res.json({
            ...session.toJSON(),
            exerciseLogs: (() => {
                try { return JSON.parse(session.exerciseLogs); }
                catch { return []; }
            })(),
        });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to get session' });
    }
};

/** GET /workout-sessions/stats/summary — aggregated user stats */
export const getStatsSummary = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const sessions = await WorkoutSession.findAll({ where: { userId } });

        const total = sessions.length;
        const totalTime = sessions.reduce((a, s) => a + s.totalTimeSeconds, 0);
        const totalSets = sessions.reduce((a, s) => a + s.totalSetsCompleted, 0);
        const avgSessionTime = total > 0 ? Math.round(totalTime / total) : 0;
        const avgRestActual = total > 0
            ? Math.round(sessions.reduce((a, s) => a + s.avgRestTimeTaken, 0) / total)
            : 0;
        const avgBetweenSets = total > 0
            ? Math.round(sessions.reduce((a, s) => a + s.avgTimeBetweenSets, 0) / total)
            : 0;

        // Streak: consecutive days with at least one session
        const dates = [...new Set(sessions.map(s =>
            new Date(s.completedAt).toDateString()
        ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < dates.length; i++) {
            const d = new Date(dates[i]);
            const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
            if (diffDays === i) streak++;
            else break;
        }

        res.json({
            totalSessions: total,
            totalTimeSeconds: totalTime,
            totalSetsCompleted: totalSets,
            avgSessionTimeSeconds: avgSessionTime,
            avgRestTimeTaken: avgRestActual,
            avgTimeBetweenSets: avgBetweenSets,
            currentStreak: streak,
        });
    } catch (error) {
        console.error('Stats summary error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
};

/** GET /workout-sessions/active — check if user has a session in progress */
export const getActiveSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const session = await WorkoutSession.findOne({
            where: { userId, status: 'active' },
            order: [['createdAt', 'DESC']]
        });

        if (!session) return res.json(null);

        res.json({
            ...session.toJSON(),
            exerciseLogs: (() => {
                try { return JSON.parse(session.exerciseLogs); }
                catch { return []; }
            })(),
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check active session' });
    }
};

/** PATCH /workout-sessions/:id — update/complete a session */
export const updateSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        const {
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            avgRestTimeTaken,
            avgTimeBetweenSets,
            exerciseLogs,
            totalVolumeKg,
            status = 'completed'
        } = req.body;

        const session = await WorkoutSession.findOne({ where: { id, userId } });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Calculate XP only if finalizing
        let gainedXP = 0;
        let user = null;

        if (status === 'completed' && session.status !== 'completed') {
            const setXP = (totalSetsCompleted || 0) * 10;
            const volumeXP = Math.floor((totalVolumeKg || 0) / 10);
            const bonusXP = 50;
            gainedXP = setXP + volumeXP + bonusXP;

            user = await require('../models/User').User.findByPk(userId);
            if (user) {
                user.xp = (user.xp || 0) + gainedXP;
                user.level = Math.floor(user.xp / 1000) + 1;
                await user.save();
            }
        }

        await session.update({
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            totalVolumeKg: totalVolumeKg || 0,
            avgRestTimeTaken: avgRestTimeTaken || 0,
            avgTimeBetweenSets: avgTimeBetweenSets || 0,
            exerciseLogs: JSON.stringify(exerciseLogs || []),
            status,
            completedAt: status === 'completed' ? new Date() : session.completedAt,
        });

        res.json({
            message: status === 'completed' ? 'Treino finalizado!' : 'Progresso salvo!',
            session,
            gainedXP,
            currentLevel: user?.level,
            totalXP: user?.xp
        });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ error: 'Failed to update session' });
    }
};

/** DELETE /workout-sessions/:id — cancel/abandon session */
export const deleteSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;
        await WorkoutSession.destroy({ where: { id, userId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete session' });
    }
};
