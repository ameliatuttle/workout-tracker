// src/components/WorkoutDetail.js
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './WorkoutDetail.css';

const WorkoutDetail = ({ workouts, setWorkouts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the workout by id
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) {
    return <div className="workout-not-found">Workout not found</div>;
  }
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Delete the workout
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      const updatedWorkouts = workouts.filter(w => w.id !== id);
      setWorkouts(updatedWorkouts);
      // Force a localStorage update
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      navigate('/');
    }
  };
  
  // Create a new workout based on this one (for repeating a similar workout)
  const createBasedOn = () => {
    const templateWorkout = {
      name: `${workout.name} (Copy)`,
      exercises: workout.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets.map(set => ({
          weight: set.weight,
          reps: set.reps
        }))
      }))
    };
    
    navigate('/add', { state: { template: templateWorkout } });
  };

  return (
    <div className="workout-detail">
      <div className="workout-detail-header">
        <Link to="/" className="back-link">← Back to Workouts</Link>
        <div className="workout-actions">
          <button onClick={createBasedOn} className="use-as-template-btn">
            Use as Template
          </button>
          <button onClick={handleDelete} className="delete-workout-btn">
            Delete
          </button>
        </div>
      </div>
      
      <h2>{workout.name}</h2>
      <p className="workout-date">{formatDate(workout.date)}</p>
      
      <div className="exercises-list">
        {workout.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="exercise-item">
            <h3>{exercise.name}</h3>
            
            <table className="sets-table">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Weight (lbs)</th>
                  <th>Reps</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex}>
                    <td>{setIndex + 1}</td>
                    <td>{set.weight}</td>
                    <td>{set.reps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      
      <div className="workout-summary">
        <h3>Workout Summary</h3>
        <ul>
          <li><strong>Total Exercises:</strong> {workout.exercises.length}</li>
          <li><strong>Total Sets:</strong> {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)}</li>
          <li><strong>Total Weight Lifted:</strong> {
            workout.exercises.reduce((total, ex) => 
              total + ex.sets.reduce((setTotal, set) => 
                setTotal + (parseInt(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)
          } lbs</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkoutDetail;