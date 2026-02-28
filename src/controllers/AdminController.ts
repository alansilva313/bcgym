import { Request, Response } from 'express';
import { User } from '../models/User';
import { WorkoutSession } from '../models/WorkoutSession';
import { Exercise } from '../models/Exercise';
import { sequelize } from '../config/database';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.count();
        const totalExercises = await Exercise.count();
        const totalSessions = await WorkoutSession.count();

        // Sum of totalWeight from all sessions
        const totalVolumeResult = await WorkoutSession.sum('totalVolumeKg') || 0;

        // Active users (sessions in the last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const activeUsersCount = await WorkoutSession.count({
            distinct: true,
            col: 'userId',
            where: {
                completedAt: {
                    [require('sequelize').Op.gte]: last7Days
                }
            }
        });

        // Recent activity (last 5 sessions)
        const recentSessions = await WorkoutSession.findAll({
            limit: 5,
            order: [['completedAt', 'DESC']],
            include: [{ model: User, as: 'user', attributes: ['name'] }]
        });

        res.json({
            stats: {
                totalUsers,
                totalExercises,
                totalSessions,
                activeUsersLast7Days: activeUsersCount,
                globalVolumeKg: Math.round(totalVolumeResult)
            },
            recentActivity: recentSessions
        });
    } catch (error: any) {
        console.error('Admin stats error:', error.message);
        res.status(500).json({ error: 'Erro ao buscar estatísticas do painel' });
    }
};
