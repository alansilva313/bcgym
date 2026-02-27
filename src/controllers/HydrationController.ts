import { Request, Response } from 'express';
import { Hydration } from '../models/Hydration';
import { User } from '../models/User';
import { Op } from 'sequelize';

export class HydrationController {
    static async addWater(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const { amount } = req.body;
            const today = new Date().toISOString().split('T')[0];

            const user = await User.findByPk(userId);
            const waterGoal = user?.weight ? Math.round(user.weight * 35) : 2000;

            let hydration = await Hydration.findOne({
                where: { userId, date: today }
            });

            if (hydration && hydration.amount >= waterGoal) {
                return res.status(400).json({ error: 'Meta diária já atingida!' });
            }

            if (hydration) {
                hydration.amount += amount;
                await hydration.save();
            } else {
                hydration = await Hydration.create({
                    userId,
                    amount,
                    date: today
                });
            }

            res.json(hydration);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao registrar água' });
        }
    }

    static async getToday(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const today = new Date().toISOString().split('T')[0];

            const hydration = await Hydration.findOne({
                where: { userId, date: today }
            });

            res.json(hydration || { amount: 0, date: today });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar hidratação' });
        }
    }
    static async getMonth(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

            const hydration = await Hydration.findAll({
                where: {
                    userId,
                    date: {
                        [Op.gte]: firstDay,
                        [Op.lte]: lastDay
                    }
                },
                order: [['date', 'ASC']]
            });

            res.json(hydration);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar histórico do mês' });
        }
    }
}
