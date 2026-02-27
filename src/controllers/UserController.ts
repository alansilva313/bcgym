import { Request, Response } from 'express';
import { User } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await User.destroy({ where: { id } });
        if (result === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
};
