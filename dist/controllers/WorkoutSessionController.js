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
exports.getStatsSummary = exports.getSessionById = exports.getMySessions = exports.createSession = void 0;
const WorkoutSession_1 = require("../models/WorkoutSession");
/** POST /workout-sessions — save a completed session */
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { workoutId, workoutName, totalTimeSeconds, totalSetsCompleted, totalExercises, avgRestTimeTaken, avgTimeBetweenSets, exerciseLogs, } = req.body;
        const session = yield WorkoutSession_1.WorkoutSession.create({
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
    }
    catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to save session' });
    }
});
exports.createSession = createSession;
/** GET /workout-sessions — get user's sessions (most recent first) */
const getMySessions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit) || 20;
        const sessions = yield WorkoutSession_1.WorkoutSession.findAll({
            where: { userId },
            order: [['completedAt', 'DESC']],
            limit,
        });
        // Parse exerciseLogs JSON for each session
        const parsed = sessions.map(s => (Object.assign(Object.assign({}, s.toJSON()), { exerciseLogs: (() => {
                try {
                    return JSON.parse(s.exerciseLogs);
                }
                catch (_a) {
                    return [];
                }
            })() })));
        res.json(parsed);
    }
    catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to get sessions' });
    }
});
exports.getMySessions = getMySessions;
/** GET /workout-sessions/:id — get a single session detail */
const getSessionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const session = yield WorkoutSession_1.WorkoutSession.findOne({ where: { id, userId } });
        if (!session)
            return res.status(404).json({ error: 'Session not found' });
        res.json(Object.assign(Object.assign({}, session.toJSON()), { exerciseLogs: (() => {
                try {
                    return JSON.parse(session.exerciseLogs);
                }
                catch (_a) {
                    return [];
                }
            })() }));
    }
    catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to get session' });
    }
});
exports.getSessionById = getSessionById;
/** GET /workout-sessions/stats/summary — aggregated user stats */
const getStatsSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const sessions = yield WorkoutSession_1.WorkoutSession.findAll({ where: { userId } });
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
        const dates = [...new Set(sessions.map(s => new Date(s.completedAt).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < dates.length; i++) {
            const d = new Date(dates[i]);
            const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
            if (diffDays === i)
                streak++;
            else
                break;
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
    }
    catch (error) {
        console.error('Stats summary error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});
exports.getStatsSummary = getStatsSummary;
