import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Workout } from './Workout';
import { Exercise } from './Exercise';

class WorkoutExercise extends Model {
    public id!: number;
    public workoutId!: number;
    public exerciseId!: number;
    public sets!: number;
    public reps!: number;
    public rest_time!: string; // e.g. '60s'
}

WorkoutExercise.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    workoutId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Workout,
            key: 'id'
        }
    },
    exerciseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exercise,
            key: 'id'
        }
    },
    sets: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
    },
    reps: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
    },
    rest_time: {
        type: DataTypes.STRING,
        defaultValue: '60s',
    }
}, {
    sequelize,
    modelName: 'WorkoutExercise',
    tableName: 'workout_exercises',
});

// Relationships
Workout.belongsToMany(Exercise, { through: WorkoutExercise, as: 'exercises', foreignKey: 'workoutId' });
Exercise.belongsToMany(Workout, { through: WorkoutExercise, as: 'workouts', foreignKey: 'exerciseId' });
Workout.hasMany(WorkoutExercise, { foreignKey: 'workoutId', as: 'workoutExercises' });
WorkoutExercise.belongsTo(Workout, { foreignKey: 'workoutId' });
WorkoutExercise.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });

export { WorkoutExercise };
