"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Exercise extends sequelize_1.Model {
}
exports.Exercise = Exercise;
Exercise.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    muscle_group: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    equipment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    gif_url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Exercise',
    tableName: 'exercises',
});
