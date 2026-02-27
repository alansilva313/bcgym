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
exports.seedExercises = void 0;
const Exercise_1 = require("../models/Exercise");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedExercises = () => __awaiter(void 0, void 0, void 0, function* () {
    const exerciseCount = yield Exercise_1.Exercise.count();
    const userCount = yield User_1.User.count();
    if (exerciseCount === 0) {
        const exercises = [
            {
                name: 'Supino Reto',
                muscle_group: 'Peito',
                level: 'Intermediário',
                equipment: 'Barra',
                description: 'O supino reto é um exercício de treinamento de força que trabalha o peito, ombros e tríceps.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o6Zt8qDiV1W5m754c/giphy.gif',
                type: 'peso_livre'
            },
            {
                name: 'Levantamento Terra',
                muscle_group: 'Costas',
                level: 'Avançado',
                equipment: 'Barra',
                description: 'O levantamento terra é um exercício composto que trabalha as costas, pernas e core.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif',
                type: 'peso_livre'
            },
            {
                name: 'Agachamento',
                muscle_group: 'Pernas',
                level: 'Intermediário',
                equipment: 'Barra',
                description: 'O agachamento trabalha principalmente as pernas e glúteos.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/v1.Y2lkPTc5MGI3NjExNHYwNngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l2JhIayrR1kI0v1ok/giphy.gif',
                type: 'peso_livre'
            },
            {
                name: 'Puxada Pulley',
                muscle_group: 'Costas',
                level: 'Iniciante',
                equipment: 'Máquina',
                description: 'A puxada pulley foca no desenvolvimento do músculo grande dorsal (lats).',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKv609M5j9Z7x7a/giphy.gif',
                type: 'maquina'
            },
            {
                name: 'Rosca Direta',
                muscle_group: 'Braços',
                level: 'Iniciante',
                equipment: 'Haltere',
                description: 'Exercício clássico para o desenvolvimento do bíceps.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3oEjI6SIIHBdRxXI40/giphy.gif',
                type: 'peso_livre'
            },
            {
                name: 'Desenvolvimento',
                muscle_group: 'Ombros',
                level: 'Intermediário',
                equipment: 'Haltere',
                description: 'Trabalha a parte anterior e lateral dos ombros.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybm5sX2dpZl9ieV9pZCZjdD1n/3o7TKVUXz3YvA5yC7C/giphy.gif',
                type: 'peso_livre'
            },
            {
                name: 'Prancha',
                muscle_group: 'Abdominais',
                level: 'Iniciante',
                equipment: 'Peso Corporal',
                description: 'Exercício isométrico fundamental para o core.',
                gif_url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4eDExYngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/v1.Y2lkPTc5MGI3NjExNHYwNngxb3R4eDN4eDN4eDN4eDN4ZGl4eHR4eDExYngxJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l2JhIayrR1kI0v1ok/giphy.gif',
                type: 'calistenia'
            }
        ];
        yield Exercise_1.Exercise.bulkCreate(exercises);
        console.log('Exercícios semeados!');
    }
    if (userCount === 0) {
        const hashedPassword = yield bcryptjs_1.default.hash('admin', 10);
        yield User_1.User.create({
            name: 'Administrador do Sistema',
            email: 'admin@gym.pro',
            password: hashedPassword,
            isAdmin: true,
            goal: 'hipertrofia',
            height: 1.80,
            weight: 80
        });
        console.log('Usuário admin semeado!');
    }
});
exports.seedExercises = seedExercises;
