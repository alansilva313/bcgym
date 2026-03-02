import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Exercise extends Model {
    public id!: number;
    public name!: string;
    public muscle_group!: string;
    public level!: string;
    public equipment!: string;
    public description!: string;
    public gif_url!: string;
    public gif_urls!: string[];
    public type!: string; // 'machine', 'free_weight', 'calisthenics'
}

Exercise.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    muscle_group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    equipment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    gif_url: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    gif_urls: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'exercises',
});

export { Exercise };
