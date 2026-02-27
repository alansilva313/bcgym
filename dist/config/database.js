"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.DATABASE_URL;
const sequelizeOptions = {
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
    define: {
        underscored: true, // This will map camelCase properties to snake_case columns
        timestamps: true,
    },
};
const sequelize = connectionString
    ? new sequelize_1.Sequelize(connectionString, sequelizeOptions)
    : new sequelize_1.Sequelize(process.env.DB_NAME || 'gym_app', process.env.DB_USER || 'root', process.env.DB_PASS || '', Object.assign({ host: process.env.DB_HOST || 'localhost' }, sequelizeOptions));
exports.sequelize = sequelize;
