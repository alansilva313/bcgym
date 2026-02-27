import { Request, Response } from 'express';
import { WorkoutSession } from '../models/WorkoutSession';
import { Op } from 'sequelize';

/** POST /workout-sessions — save a completed session */
export const createSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {
            workoutId,
            workoutName,
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            avgRestTimeTaken,
            avgTimeBetweenSets,
            exerciseLogs,
        } = req.body;

        const session = await WorkoutSession.create({
            userId,
            workoutId,
            workoutName,
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            avgRestTimeTaken: avgRestTimeTaken || 0,
            avgTimeBetweenSets: avgTimeBetweenSets || 0,
            exerciseLogs: JSON.stringify(exerciseLogs || []),
            completedAt: new Date(),
        });

        res.status(201).json({ message: 'Session saved', session });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to save session' });
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
