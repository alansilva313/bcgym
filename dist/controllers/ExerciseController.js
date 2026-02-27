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
exports.deleteExercise = exports.updateExercise = exports.getExerciseById = exports.createExercise = exports.getAllExercises = void 0;
const Exercise_1 = require("../models/Exercise");
const getAllExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { muscle_group, level, type } = req.query;
        const filters = {};
        if (muscle_group)
            filters.muscle_group = muscle_group;
        if (level)
            filters.level = level;
        if (type)
            filters.type = type;
        const exercises = yield Exercise_1.Exercise.findAll({ where: filters });
        res.json(exercises);
    }
    catch (error) {
        res.status(500).json({ error: 'Falha ao buscar exercícios' });
    }
});
exports.getAllExercises = getAllExercises;
const createExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, muscle_group, level, equipment, description, gif_url, type } = req.body;
        const exercise = yield Exercise_1.Exercise.create({
            name,
            muscle_group,
            level,
            equipment,
            description,
            gif_url,
            type
        });
        res.status(201).json(exercise);
    }
    catch (error) {
        res.status(500).json({ error: 'Falha ao criar exercício' });
    }
});
exports.createExercise = createExercise;
const getExerciseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exercise = yield Exercise_1.Exercise.findByPk(Number(id));
        if (!exercise)
            return res.status(404).json({ error: 'Exercício não encontrado' });
        res.json(exercise);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar exercício' });
    }
});
exports.getExerciseById = getExerciseById;
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, muscle_group, level, equipment, description, gif_url, type } = req.body;
        const exercise = yield Exercise_1.Exercise.findByPk(Number(id));
        if (!exercise)
            return res.status(404).json({ error: 'Exercício não encontrado' });
        yield exercise.update({
            name,
            muscle_group,
            level,
            equipment,
            description,
            gif_url,
            type
        });
        res.json(exercise);
    }
    catch (error) {
        res.status(500).json({ error: 'Falha ao atualizar exercício' });
    }
});
exports.updateExercise = updateExercise;
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exercise = yield Exercise_1.Exercise.findByPk(Number(id));
        if (!exercise)
            return res.status(404).json({ error: 'Exercício não encontrado' });
        yield exercise.destroy();
        res.json({ message: 'Exercício excluído com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Falha ao excluir exercício' });
    }
});
exports.deleteExercise = deleteExercise;
