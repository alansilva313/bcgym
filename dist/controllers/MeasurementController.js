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
exports.MeasurementController = void 0;
const Measurement_1 = require("../models/Measurement");
class MeasurementController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const data = Object.assign(Object.assign({}, req.body), { userId });
                const measurement = yield Measurement_1.Measurement.create(data);
                res.status(201).json(measurement);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao salvar medidas' });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const measurements = yield Measurement_1.Measurement.findAll({
                    where: { userId },
                    order: [['date', 'DESC']]
                });
                res.json(measurements);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar histórico de medidas' });
            }
        });
    }
    static getLatest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const measurement = yield Measurement_1.Measurement.findOne({
                    where: { userId },
                    order: [['date', 'DESC']]
                });
                res.json(measurement);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar última medida' });
            }
        });
    }
}
exports.MeasurementController = MeasurementController;
