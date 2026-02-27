import { Exercise } from '../models/Exercise';

export const translateExistingExercises = async () => {
    const translationMap: { [key: string]: { name?: string, muscle_group?: string, level?: string, equipment?: string } } = {
        'Chest': { muscle_group: 'Peito' },
        'Back': { muscle_group: 'Costas' },
        'Legs': { muscle_group: 'Pernas' },
        'Shoulders': { muscle_group: 'Ombros' },
        'Arms': { muscle_group: 'Braços' },
        'Abs': { muscle_group: 'Abdominais' },
        'Bench Press': { name: 'Supino Reto', equipment: 'Barra' },
        'Deadlift': { name: 'Levantamento Terra', equipment: 'Barra' },
        'Squat': { name: 'Agachamento', equipment: 'Barra' },
        'Lat Pulldown': { name: 'Puxada Pulley', equipment: 'Máquina' },
        'Bicep Curl': { name: 'Rosca Direta', equipment: 'Haltere' },
        'Shoulder Press': { name: 'Desenvolvimento', equipment: 'Haltere' },
        'Plank': { name: 'Prancha', equipment: 'Peso Corporal' },
        'Intermediate': { level: 'Intermediário' },
        'Beginner': { level: 'Iniciante' },
        'Advanced': { level: 'Avançado' },
        'Barbell': { equipment: 'Barra' },
        'Dumbbell': { equipment: 'Haltere' },
        'Machine': { equipment: 'Máquina' },
        'Bodyweight': { equipment: 'Peso Corporal' }
    };

    const exercises = await Exercise.findAll();

    for (const exercise of exercises) {
        let updated = false;

        // Translate Muscle Group
        if (translationMap[exercise.muscle_group]) {
            exercise.muscle_group = translationMap[exercise.muscle_group].muscle_group || exercise.muscle_group;
            updated = true;
        }

        // Translate Name
        if (translationMap[exercise.name]) {
            const map = translationMap[exercise.name];
            exercise.name = map.name || exercise.name;
            if (map.equipment) exercise.equipment = map.equipment;
            updated = true;
        }

        // Translate Level
        if (translationMap[exercise.level]) {
            exercise.level = translationMap[exercise.level].level || exercise.level;
            updated = true;
        }

        // Translate Equipment (direct check)
        if (translationMap[exercise.equipment]) {
            exercise.equipment = translationMap[exercise.equipment].equipment || exercise.equipment;
            updated = true;
        }

        if (updated) {
            await exercise.save();
        }
    }

    console.log('Exercises translation check/update completed.');
};
