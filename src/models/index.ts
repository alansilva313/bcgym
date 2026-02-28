import { User } from './User';
import { Exercise } from './Exercise';
import { Workout } from './Workout';
import { WorkoutExercise } from './WorkoutExercise';
import { Hydration } from './Hydration';
import { WorkoutSession } from './WorkoutSession';
import { Measurement } from './Measurement';

// Relationships
// Hydration
User.hasMany(Hydration, { foreignKey: 'userId' });
Hydration.belongsTo(User, { foreignKey: 'userId' });

// Measurements
User.hasMany(Measurement, { foreignKey: 'userId' });
Measurement.belongsTo(User, { foreignKey: 'userId' });

// Workouts
User.hasMany(Workout, { foreignKey: 'userId', as: 'workouts' });
Workout.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Workout.belongsTo(User, { foreignKey: 'trainerId', as: 'trainer' });

// WorkoutExercise (Many-to-Many + Direct)
Workout.belongsToMany(Exercise, { through: WorkoutExercise, as: 'exercises', foreignKey: 'workoutId' });
Exercise.belongsToMany(Workout, { through: WorkoutExercise, as: 'workouts', foreignKey: 'exerciseId' });

Workout.hasMany(WorkoutExercise, { foreignKey: 'workoutId', as: 'workoutExercises' });
WorkoutExercise.belongsTo(Workout, { foreignKey: 'workoutId' });
WorkoutExercise.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });

// Workout Sessions
User.hasMany(WorkoutSession, { foreignKey: 'userId', as: 'workoutSessions' });
WorkoutSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Workout.hasMany(WorkoutSession, { foreignKey: 'workoutId', as: 'sessions' });
WorkoutSession.belongsTo(Workout, { foreignKey: 'workoutId', as: 'workout' });

export {
    User,
    Exercise,
    Workout,
    WorkoutExercise,
    Hydration,
    WorkoutSession,
    Measurement
};
