"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydration = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Hydration extends sequelize_1.Model {
}
exports.Hydration = Hydration;
Hydration.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Hydration',
});
