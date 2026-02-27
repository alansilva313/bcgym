"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSession = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Workout_1 = require("./Workout");
/**
 * WorkoutSession — stores a completed training session with full performance metrics.
 *
 * exerciseLogs JSON structure:
 * [
 *   {
 *     exerciseId: number,
 *     exerciseName: string,
 *     sets: [
 *       {
 *         setNumber: number,
 *         completedAt: ISO string,
 *         timeBetweenSets: number,   // seconds between this set and the previous set
 *         restTimeTaken: number,     // seconds of rest the user actually took
 *         restTimeOffered: number,   // seconds offered (60s default)
 *       }
 *     ]
 *   }
 * ]
 */
class WorkoutSession extends sequelize_1.Model {
}
exports.WorkoutSession = WorkoutSession;
WorkoutSession.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: User_1.User, key: 'id' },
    },
    workoutId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: Workout_1.Workout, key: 'id' },
    },
    workoutName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    totalTimeSeconds: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalSetsCompleted: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalExercises: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    avgRestTimeTaken: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    avgTimeBetweenSets: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    exerciseLogs: {
        type: sequelize_1.DataTypes.TEXT, // stored as JSON string
        allowNull: true,
        defaultValue: '[]',
    },
    completedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'WorkoutSession',
    tableName: 'workout_sessions',
});
// Relationships
User_1.User.hasMany(WorkoutSession, { foreignKey: 'userId', as: 'workoutSessions' });
WorkoutSession.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
Workout_1.Workout.hasMany(WorkoutSession, { foreignKey: 'workoutId', as: 'sessions' });
WorkoutSession.belongsTo(Workout_1.Workout, { foreignKey: 'workoutId', as: 'workout' });
