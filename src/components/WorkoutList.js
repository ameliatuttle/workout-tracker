// src/components/WorkoutList.js
import React from 'react';
import { Link } from 'react-router-dom';
import './WorkoutList.css';

const WorkoutList = ({ workouts }) => {
  // Format date to a readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group workouts by month for better organization
  const groupByMonth = () => {
    const grouped = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(workout);
    });
    
    // Sort workouts within each month by date (newest first)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    
    return grouped;
  };

  const groupedWorkouts = groupByMonth();
  const months = Object.keys(groupedWorkouts).sort((a, b) => {
    // Sort months in reverse chronological order
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA;
  });

  return (
    <div className="workout-list">
      <div className="workout-list-header">
        <h2>Your Workouts</h2>
        <Link to="/add" className="add-workout-btn">Add New Workout</Link>
      </div>
      
      {workouts.length === 0 ? (
        <div className="no-workouts">
          <p>You haven't logged any workouts yet. Start by adding your first workout!</p>
        </div>
      ) : (
        <div className="workouts-by-month">
          {months.map(month => (
            <div key={month} className="month-group">
              <h3 className="month-header">{month}</h3>
              <div className="month-workouts">
                {groupedWorkouts[month].map(workout => (
                  <Link 
                    to={`/workout/${workout.id}`} 
                    key={workout.id} 
                    className="workout-card"
                  >
                    <div className="workout-card-date">{formatDate(workout.date)}</div>
                    <h3 className="workout-card-title">{workout.name}</h3>
                    <div className="workout-card-details">
                      <p>{workout.exercises.length} exercises</p>
                      <p>{workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)} sets total</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;