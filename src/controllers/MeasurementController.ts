import { Request, Response } from 'express';
import { Measurement } from '../models/Measurement';

export class MeasurementController {
    static async create(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const data = { ...req.body, userId };

            const measurement = await Measurement.create(data);
            res.status(201).json(measurement);
        } catch (error) {
            console.error('Error creating measurement:', error);
            res.status(500).json({ error: 'Erro ao salvar medidas' });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const measurements = await Measurement.findAll({
                where: { userId },
                order: [['date', 'DESC']]
            });
            res.json(measurements);
        } catch (error) {
            console.error('Error fetching measurements:', error);
            res.status(500).json({ error: 'Erro ao buscar histórico de medidas' });
        }
    }

    static async getLatest(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const measurement = await Measurement.findOne({
                where: { userId },
                order: [['date', 'DESC'], ['createdAt', 'DESC']]
            });
            res.json(measurement);
        } catch (error) {
            console.error('Error fetching latest measurement:', error);
            res.status(500).json({ error: 'Erro ao buscar última medida' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const userId = (req as any).userId;
            const { id } = req.params;

            const measurement = await Measurement.findOne({
                where: { id, userId }
            });

            if (!measurement) {
                return res.status(404).json({ error: 'Medida não encontrada' });
            }

            await measurement.destroy();
            res.json({ message: 'Medida excluída com sucesso' });
        } catch (error) {
            console.error('Error deleting measurement:', error);
            res.status(500).json({ error: 'Erro ao excluir medida' });
        }
    }
}
