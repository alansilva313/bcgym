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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = exports.googleLogin = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_gym_key';
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, goal, height, weight, gender } = req.body;
        const existingUser = yield User_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'E-mail já está em uso' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.User.create({
            name,
            email,
            password: hashedPassword,
            goal,
            height,
            weight,
            gender,
            language: req.body.language || 'pt'
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.error('Erro no Registro:', error);
        res.status(500).json({ error: 'Falha ao criar conta' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        console.error('Erro no Login:', error);
        res.status(500).json({ error: 'Falha no login' });
    }
});
exports.login = login;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken, language } = req.body;
        const ticket = yield googleClient.verifyIdToken({
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
        let user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            // Create user mapped with Google
            user = yield User_1.User.create({
                email,
                name,
                googleId,
                language: language || 'pt',
                // other default fields stay null
            });
        }
        else if (!user.googleId) {
            // Update existing user with Google ID
            yield user.update({ googleId });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        console.error('Erro no Google Login:', error);
        // Handle case where GOOGLE_CLIENT_ID isn't configured correctly by falling back or telling frontend
        res.status(500).json({ error: 'Falha no login social com o Google' });
    }
});
exports.googleLogin = googleLogin;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
});
exports.getMe = getMe;
const updateMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { name, goal, height, weight, language, age, birthDate, gender } = req.body;
        const user = yield User_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        yield user.update({
            name: name || user.name,
            goal: goal || user.goal,
            height: height !== undefined ? height : user.height,
            weight: weight !== undefined ? weight : user.weight,
            language: language || user.language,
            age: age !== undefined ? age : user.age,
            birthDate: birthDate !== undefined ? birthDate : user.birthDate,
            gender: gender || user.gender
        });
        res.json(user);
    }
    catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Falha ao atualizar perfil' });
    }
});
exports.updateMe = updateMe;
