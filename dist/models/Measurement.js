"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Measurement extends sequelize_1.Model {
}
exports.Measurement = Measurement;
Measurement.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    weight: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    chest: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    waist: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    hips: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    leftArm: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    rightArm: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    leftThigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    rightThigh: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    leftCalf: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    rightCalf: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    shoulders: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Measurement',
    tableName: 'measurements',
});
