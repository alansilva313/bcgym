import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_gym_key';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, goal, height, weight, gender, waterReminderInterval } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já está em uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            goal,
            height,
            weight,
            gender,
            waterReminderInterval: waterReminderInterval || 0,
            language: req.body.language || 'pt'
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Erro no Registro:', error);
        res.status(500).json({ error: 'Falha ao criar conta' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });
    } catch (error) {
        console.error('Erro no Login:', error);
        res.status(500).json({ error: 'Falha no login' });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken, language } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID || '',
            // If the client ID is not set yet, it might fail verification if audience differs.
            // Ideally env GOOGLE_CLIENT_ID should match the CLI web clientId.
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Token do Google inválido' });
        }

        const email = payload.email;
        const name = payload.name || 'Usuário Google';
        const googleId = payload.sub;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create user mapped with Google
            user = await User.create({
                email,
                name,
                googleId,
                language: language || 'pt',
                // other default fields stay null
            });
        } else if (!user.googleId) {
            // Update existing user with Google ID
            await user.update({ googleId });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ user, token });

    } catch (error) {
        console.error('Erro no Google Login:', error);

        // Handle case where GOOGLE_CLIENT_ID isn't configured correctly by falling back or telling frontend
        res.status(500).json({ error: 'Falha no login social com o Google' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { name, goal, height, weight, language, age, birthDate, gender, waterReminderInterval } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.update({
            name: name || user.name,
            goal: goal || user.goal,
            height: height !== undefined ? height : user.height,
            weight: weight !== undefined ? weight : user.weight,
            language: language || user.language,
            age: age !== undefined ? age : user.age,
            birthDate: birthDate !== undefined ? birthDate : user.birthDate,
            gender: gender || user.gender,
            waterReminderInterval: waterReminderInterval !== undefined ? waterReminderInterval : user.waterReminderInterval
        });

        res.json(user);
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Falha ao atualizar perfil' });
    }
};
