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
            caloriesBurned = 0,
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
            caloriesBurned,
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

        if (!id || id === 'null' || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await WorkoutSession.findOne({ where: { id: Number(id), userId } });
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

        // Streak: only completed sessions with a date
        const completedSessions = sessions.filter(s => s.status === 'completed' && s.completedAt);
        const dates = [...new Set(completedSessions.map(s =>
            new Date(s.completedAt!).toDateString()
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

        if (!id || id === 'null' || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const {
            totalTimeSeconds,
            totalSetsCompleted,
            totalExercises,
            avgRestTimeTaken,
            avgTimeBetweenSets,
            exerciseLogs,
            totalVolumeKg,
            caloriesBurned,
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
            caloriesBurned: caloriesBurned !== undefined ? caloriesBurned : session.caloriesBurned,
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

        if (!id || id === 'null' || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        await WorkoutSession.destroy({ where: { id: Number(id), userId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

/** GET /workout-sessions/stats/heatmap — muscle heat map data */
export const getMuscleHeatMap = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sessions = await WorkoutSession.findAll({
            where: {
                userId,
                [Op.or]: [
                    { status: 'completed', completedAt: { [Op.gte]: sevenDaysAgo } },
                    { status: 'active', createdAt: { [Op.gte]: sevenDaysAgo } }
                ]
            }
        });

        const muscleStats: { [key: string]: number } = {
            'Peito': 0, 'Costas': 0, 'Pernas': 0, 'Ombros': 0,
            'Bíceps': 0, 'Tríceps': 0, 'Abdominais': 0,
            'Panturrilha': 0, 'Glúteos': 0, 'Quadríceps': 0,
            'Posterior': 0, 'Lombar': 0, 'Trapézio': 0
        };

        const exerciseIds = new Set<number>();
        sessions.forEach(s => {
            const logs = JSON.parse(s.exerciseLogs || '[]');
            logs.forEach((l: any) => exerciseIds.add(l.exerciseId));
        });

        const exercises = await require('../models/Exercise').Exercise.findAll({
            where: { id: Array.from(exerciseIds) }
        });

        const idToMuscle: { [key: number]: string } = {};
        exercises.forEach((ex: any) => {
            idToMuscle[ex.id] = ex.muscle_group;
        });

        const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        sessions.forEach(s => {
            const logs = JSON.parse(s.exerciseLogs || '[]');
            logs.forEach((l: any) => {
                const muscleInput = idToMuscle[l.exerciseId];
                if (!muscleInput) return;

                const sets = l.sets?.length || 0;
                // Split muscle group if it contains multiple items like "Peito e Tríceps"
                const rawGroups = muscleInput.split(/[,e/&]|\s+e\s+/).map(s => s.trim());

                rawGroups.forEach(rawGroup => {
                    if (!rawGroup) return;
                    const normalizedMuscle = normalize(rawGroup);

                    // Smarter muscle recruitment mapping
                    if (normalizedMuscle.includes('peito')) {
                        muscleStats['Peito'] += sets;
                        muscleStats['Tríceps'] += Math.round(sets * 0.4);
                        muscleStats['Ombros'] += Math.round(sets * 0.3);
                    } else if (normalizedMuscle.includes('costas')) {
                        muscleStats['Costas'] += sets;
                        muscleStats['Bíceps'] += Math.round(sets * 0.4);
                        muscleStats['Trapézio'] += Math.round(sets * 0.3);
                        muscleStats['Lombar'] += Math.round(sets * 0.2);
                    } else if (normalizedMuscle.includes('ombro')) {
                        muscleStats['Ombros'] += sets;
                        muscleStats['Tríceps'] += Math.round(sets * 0.2);
                        muscleStats['Trapézio'] += Math.round(sets * 0.2);
                    } else if (normalizedMuscle.includes('perna') || normalizedMuscle.includes('quadriceps')) {
                        muscleStats['Quadríceps'] += sets;
                        muscleStats['Glúteos'] += Math.round(sets * 0.3);
                        muscleStats['Pernas'] += sets;
                    } else if (normalizedMuscle.includes('posterior')) {
                        muscleStats['Posterior'] += sets;
                        muscleStats['Glúteos'] += Math.round(sets * 0.4);
                        muscleStats['Lombar'] += Math.round(sets * 0.2);
                    } else if (normalizedMuscle.includes('braco') || normalizedMuscle.includes('bicep') || normalizedMuscle.includes('tricep')) {
                        if (normalizedMuscle.includes('bicep')) muscleStats['Bíceps'] += sets;
                        if (normalizedMuscle.includes('tricep')) muscleStats['Tríceps'] += sets;
                        if (normalizedMuscle.includes('braco')) {
                            muscleStats['Bíceps'] += sets;
                            muscleStats['Tríceps'] += sets;
                        }
                    } else {
                        // Generic matching for direct hits
                        const match = Object.keys(muscleStats).find(k => normalize(k) === normalizedMuscle);
                        if (match) muscleStats[match] += sets;
                    }
                });
            });
        });

        res.json(muscleStats);
    } catch (error) {
        console.error('HeatMap stats error:', error);
        res.status(500).json({ error: 'Failed to get body stats' });
    }
};

/** GET /workout-sessions/overload/:workoutId — get overload suggestions */
export const getOverloadSuggestions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { workoutId } = req.params;

        // 1. Get current workout exercises
        const workout = await require('../models/Workout').Workout.findOne({
            where: { id: workoutId },
            include: [{ model: require('../models/Exercise').Exercise, as: 'exercises' }]
        });

        if (!workout) return res.status(404).json({ error: 'Workout not found' });

        // 2. Get the last 5 completed sessions for this user
        const lastSessions = await WorkoutSession.findAll({
            where: { userId, status: 'completed' },
            order: [['completedAt', 'DESC']],
            limit: 5
        });

        const suggestions: { [key: number]: { suggestion: string, lastLoad: string } } = {};

        // 3. For each exercise in the workout, check if we should suggest an increase
        for (const ex of (workout.exercises || [])) {
            const exerciseId = ex.id;

            // Find the most recent session containing this exercise
            let lastLog = null;
            for (const session of lastSessions) {
                const logs = JSON.parse(session.exerciseLogs || '[]');
                const found = logs.find((l: any) => l.exerciseId === exerciseId);
                if (found) {
                    lastLog = found;
                    break;
                }
            }

            if (lastLog) {
                const completedSets = lastLog.sets?.length || 0;

                // Get intended sets for this exercise in this workout
                const workoutEx = await require('../models/WorkoutExercise').WorkoutExercise.findOne({
                    where: { workoutId, exerciseId }
                });

                const intendedSets = workoutEx?.sets || 3;

                if (completedSets >= intendedSets) {
                    const lastLoadStr = lastLog.sets[lastLog.sets.length - 1]?.load || '0';
                    const lastLoad = parseFloat(lastLoadStr.replace(/[^0-9.]/g, '')) || 0;

                    if (lastLoad > 0) {
                        // Suggest ~5% increase
                        const increase = Math.max(1, Math.round(lastLoad * 0.05));
                        suggestions[exerciseId] = {
                            suggestion: `Aumentar +${increase}kg?`,
                            lastLoad: lastLoadStr
                        };
                    }
                }
            }
        }

        res.json(suggestions);
    } catch (error) {
        console.error('Overload suggestions error:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
};
