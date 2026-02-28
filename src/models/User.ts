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
    public initialWeight!: number;
    public targetWeight!: number;
    public age!: number;
    public birthDate!: Date;
    public isAdmin!: boolean;
    public language!: string;
    public gender!: string;
    public googleId?: string;
    public waterReminderInterval!: number;
    public xp!: number;
    public level!: number;
    public workoutTime!: string; // Preferred workout time, e.g. '18:00'
    public pairingCode!: string; // Code for students to share with trainers
    public trainerId?: number;   // FK to the trainer (User)
    public licenseNumber?: string; // For trainers
    public role!: 'student' | 'trainer' | 'admin';
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
    initialWeight: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    targetWeight: {
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
    },
    workoutTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pairingCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    licenseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('student', 'trainer', 'admin'),
        allowNull: false,
        defaultValue: 'student',
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

export { User };

// Relationships
User.belongsTo(User, { as: 'trainer', foreignKey: 'trainerId' });
User.hasMany(User, { as: 'students', foreignKey: 'trainerId' });
