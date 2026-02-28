import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public goal!: string;
    public height!: number;
    public weight!: number;
    public age!: number;
    public birthDate!: Date;
    public isAdmin!: boolean;
    public language!: string;
    public gender!: string;
    public googleId?: string;
    public waterReminderInterval!: number;
    public xp!: number;
    public level!: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    goal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pt',
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    waterReminderInterval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

export { User };
