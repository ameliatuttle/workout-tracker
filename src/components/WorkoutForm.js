// src/components/WorkoutForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WorkoutForm.css';

const WorkoutForm = ({ addWorkout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template;

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: [{ weight: '', reps: '' }] }
  ]);

  // Initialize form with template data if available
  useEffect(() => {
    if (template) {
      setWorkoutName(template.name);
      setExercises(template.exercises);
    }
  }, [template]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const workout = {
      name: workoutName,
      exercises: exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.filter(set => set.weight && set.reps)
      })).filter(ex => ex.name && ex.sets.length > 0)
    };
    
    addWorkout(workout);
    navigate('/');
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    const lastSet = currentSets[currentSets.length - 1];
    
    // Copy values from the last set if it exists and has values
    const newSet = {
      weight: lastSet.weight || '',
      reps: lastSet.reps || ''
    };
    
    updatedExercises[exerciseIndex].sets.push(newSet);
    setExercises(updatedExercises);
  };

  const updateExerciseName = (index, name) => {
    const updatedExercises = [...exercises];
    updatedExercises[index].name = name;
    setExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  return (
    <div className="workout-form">
      <h2>Add New Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Workout Name:</label>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            required
            placeholder="e.g., Monday Leg Day"
          />
        </div>

        <h3>Exercises</h3>
        {exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="exercise-container">
            <div className="form-group">
              <label>Exercise Name:</label>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => updateExerciseName(exerciseIndex, e.target.value)}
                placeholder="e.g., Bench Press"
                required
              />
            </div>

            <h4>Sets</h4>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="set-container">
                <div className="set-inputs">
                  <div className="form-group set-input">
                    <label>Weight (lbs):</label>
                    <div className="input-with-controls">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                        placeholder="135"
                        min="0"
                        className="number-input"
                        style={{ color: '#333' }}
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="400" 
                        step="5"
                        value={set.weight || 0}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                        className="number-slider"
                      />
                    </div>
                  </div>
                  <div className="form-group set-input">
                    <label>Reps:</label>
                    <div className="input-with-controls">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                        placeholder="8"
                        min="0"
                        className="number-input"
                        style={{ color: '#333' }}
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="15" 
                        step="1"
                        value={set.reps || 0}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                        className="number-slider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button 
              type="button" 
              className="add-set-btn" 
              onClick={() => addSet(exerciseIndex)}
            >
              + Add Another Set
            </button>
          </div>
        ))}
        
        <button type="button" className="add-exercise-btn" onClick={addExercise}>
          + Add Another Exercise
        </button>
        
        <button type="submit" className="submit-btn">Save Workout</button>
      </form>
    </div>
  );
};

export default WorkoutForm;