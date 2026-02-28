import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Workout } from './Workout';

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
 *         load: string,              // weight/load used (e.g. '20kg' or 'Anilha')
 *       }
 *     ]
 *   }
 * ]
 */
class WorkoutSession extends Model {
    public id!: number;
    public userId!: number;
    public workoutId!: number;
    public workoutName!: string;
    public totalTimeSeconds!: number;    // Total session duration
    public totalSetsCompleted!: number;
    public totalExercises!: number;
    public totalVolumeKg!: number;      // Total weight lifted in the session (kg)
    public avgRestTimeTaken!: number;    // Average rest actually taken (seconds)
    public avgTimeBetweenSets!: number;  // Average time between completing sets (seconds)
    public exerciseLogs!: string;        // JSON string with per-set detail
    public status!: 'active' | 'completed' | 'cancelled';
    public completedAt?: Date | null;
}

WorkoutSession.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' },
    },
    workoutId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: Workout, key: 'id' },
    },
    workoutName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalTimeSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalSetsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalExercises: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalVolumeKg: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    avgRestTimeTaken: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    avgTimeBetweenSets: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    exerciseLogs: {
        type: DataTypes.TEXT,   // stored as JSON string
        allowNull: true,
        defaultValue: '[]',
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'WorkoutSession',
    tableName: 'workout_sessions',
});

export { WorkoutSession };
