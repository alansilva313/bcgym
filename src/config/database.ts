import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';
import * as pg from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const sequelizeOptions: Options = {
    dialect: (process.env.DB_DIALECT as any) || 'postgres',
    dialectModule: pg,
    logging: false,
    define: {
        underscored: true,
        timestamps: true,
    },
    pool: {
        max: 2, // Even more conservative for serverless
        min: 0,
        acquire: 30000,
        idle: 1000, // Release connections faster (1s instead of 10s)
        evict: 1000,
    },
};

const sequelize = connectionString
    ? new Sequelize(connectionString, sequelizeOptions)
    : new Sequelize(
        process.env.DB_NAME || 'gym_app',
        process.env.DB_USER || 'root',
        process.env.DB_PASS || '',
        {
            host: process.env.DB_HOST || 'localhost',
            ...sequelizeOptions
        }
    );

export { sequelize };
