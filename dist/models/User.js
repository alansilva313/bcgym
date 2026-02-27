"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    goal: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pt',
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'User',
    tableName: 'users',
});
