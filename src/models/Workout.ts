import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

class Workout extends Model {
    public id!: number;
    public userId!: number;
    public trainerId?: number;
    public name!: string;
    public goal!: string;
    public daysOfWeek!: string; // Stored as comma separated string e.g. 'Monday,Wednesday,Friday'
}

Workout.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    trainerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    goal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    daysOfWeek: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Workout',
    tableName: 'workouts',
});

// Relationships
User.hasMany(Workout, { foreignKey: 'userId', as: 'workouts' });
Workout.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Workout.belongsTo(User, { foreignKey: 'trainerId', as: 'trainer' });

export { Workout };
