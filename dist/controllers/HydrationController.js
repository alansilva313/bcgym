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
exports.HydrationController = void 0;
const Hydration_1 = require("../models/Hydration");
const User_1 = require("../models/User");
const sequelize_1 = require("sequelize");
class HydrationController {
    static addWater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { amount } = req.body;
                const today = new Date().toISOString().split('T')[0];
                const user = yield User_1.User.findByPk(userId);
                const waterGoal = (user === null || user === void 0 ? void 0 : user.weight) ? Math.round(user.weight * 35) : 2000;
                let hydration = yield Hydration_1.Hydration.findOne({
                    where: { userId, date: today }
                });
                if (hydration && hydration.amount >= waterGoal) {
                    return res.status(400).json({ error: 'Meta diária já atingida!' });
                }
                if (hydration) {
                    hydration.amount += amount;
                    yield hydration.save();
                }
                else {
                    hydration = yield Hydration_1.Hydration.create({
                        userId,
                        amount,
                        date: today
                    });
                }
                res.json(hydration);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao registrar água' });
            }
        });
    }
    static getToday(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const today = new Date().toISOString().split('T')[0];
                const hydration = yield Hydration_1.Hydration.findOne({
                    where: { userId, date: today }
                });
                res.json(hydration || { amount: 0, date: today });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar hidratação' });
            }
        });
    }
    static getMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
                const hydration = yield Hydration_1.Hydration.findAll({
                    where: {
                        userId,
                        date: {
                            [sequelize_1.Op.gte]: firstDay,
                            [sequelize_1.Op.lte]: lastDay
                        }
                    },
                    order: [['date', 'ASC']]
                });
                res.json(hydration);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar histórico do mês' });
            }
        });
    }
}
exports.HydrationController = HydrationController;
