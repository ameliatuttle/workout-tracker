import React, { useState, useEffect } from 'react';
import './ProgressDashboard.css';

const ProgressDashboard = ({ workouts }) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [progressData, setProgressData] = useState([]);
  
  // Extract unique exercise names from all workouts
  useEffect(() => {
    const exercises = new Set();
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    
    setExerciseList([...exercises].sort());
    if (exercises.size > 0 && !selectedExercise) {
      setSelectedExercise([...exercises][0]);
    }
  }, [workouts, selectedExercise]);
  
  // Generate progress data when selected exercise changes
  useEffect(() => {
    if (!selectedExercise) return;
    
    const data = [];
    
    // Sort workouts by date (oldest first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    sortedWorkouts.forEach(workout => {
      const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
      
      if (exercise) {
        // Find the max weight for this exercise
        let maxWeight = 0;
        let maxWeightReps = 0;
        let totalVolume = 0;
        
        exercise.sets.forEach(set => {
          const weight = parseInt(set.weight) || 0;
          const reps = parseInt(set.reps) || 0;
          
          totalVolume += weight * reps;
          
          if (weight > maxWeight) {
            maxWeight = weight;
            maxWeightReps = reps;
          }
        });
        
        data.push({
          date: new Date(workout.date).toLocaleDateString(),
          maxWeight,
          maxWeightReps,
          totalVolume,
          sets: exercise.sets.length
        });
      }
    });
    
    setProgressData(data);
  }, [selectedExercise, workouts]);
  
  // Calculate statistics
  const calculateStats = () => {
    if (progressData.length === 0) return null;
    
    const currentMax = progressData[progressData.length - 1].maxWeight;
    const initialMax = progressData[0].maxWeight;
    const improvement = currentMax - initialMax;
    const percentImprovement = initialMax > 0 ? (improvement / initialMax) * 100 : 0;
    
    const currentVolume = progressData[progressData.length - 1].totalVolume;
    const initialVolume = progressData[0].totalVolume;
    const volumeImprovement = currentVolume - initialVolume;
    const volumePercentImprovement = initialVolume > 0 ? (volumeImprovement / initialVolume) * 100 : 0;
    
    return {
      improvement,
      percentImprovement,
      volumeImprovement,
      volumePercentImprovement,
      workoutCount: progressData.length
    };
  };
  
  const stats = calculateStats();

  return (
    <div className="progress-dashboard">
      <h2>Your Progress</h2>
      
      {exerciseList.length === 0 ? (
        <div className="no-exercises">
          <p>You haven't logged any exercises yet. Start by adding workouts!</p>
        </div>
      ) : (
        <>
          <div className="exercise-selector">
            <label htmlFor="exercise-select">Select Exercise:</label>
            <select 
              id="exercise-select" 
              value={selectedExercise} 
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {exerciseList.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>
          
          {progressData.length === 0 ? (
            <p className="no-data">No data available for this exercise.</p>
          ) : (
            <div className="progress-content">
              <div className="progress-stats">
                <div className="stat-card">
                  <h3>Max Weight</h3>
                  <div className="stat-value">{progressData[progressData.length - 1].maxWeight} lbs</div>
                  {stats && stats.improvement !== 0 && (
                    <div className={`stat-change ${stats.improvement > 0 ? 'positive' : 'negative'}`}>
                      {stats.improvement > 0 ? '+' : ''}{stats.improvement} lbs ({stats.percentImprovement.toFixed(1)}%)
                    </div>
                  )}
                </div>
                
                <div className="stat-card">
                  <h3>Volume</h3>
                  <div className="stat-value">{progressData[progressData.length - 1].totalVolume} lbs</div>
                  {stats && stats.volumeImprovement !== 0 && (
                    <div className={`stat-change ${stats.volumeImprovement > 0 ? 'positive' : 'negative'}`}>
                      {stats.volumeImprovement > 0 ? '+' : ''}{stats.volumeImprovement} lbs ({stats.volumePercentImprovement.toFixed(1)}%)
                    </div>
                  )}
                </div>
                
                <div className="stat-card">
                  <h3>Consistency</h3>
                  <div className="stat-value">{stats ? stats.workoutCount : 0}</div>
                  <div className="stat-label">workouts with this exercise</div>
                </div>
              </div>
              
              <div className="progress-chart">
                <h3>Weight Progress Chart</h3>
                <div className="chart-container">
                  <div className="chart-y-axis">
                    {[...Array(5)].map((_, i) => {
                      const value = Math.round(400 - (i * 100));
                      return <div key={i} className="y-axis-label">{value}</div>
                    })}
                  </div>
                  
                  <div className="chart-content">
                    <div className="chart-bars">
                      {progressData.map((data, index) => {
                        const maxWeight = Math.max(...progressData.map(d => d.maxWeight));
                        const height = maxWeight > 0 ? (data.maxWeight / maxWeight) * 100 : 0;
                        return (
                          <div key={index} className="chart-bar-wrapper" title={`${data.date}: ${data.maxWeight} lbs`}>
                            <div 
                              className="chart-bar" 
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="chart-bar-label">{data.maxWeight}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="chart-x-axis">
                      {progressData.map((data, index) => (
                        <div key={index} className="x-axis-label">
                          {new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="exercise-history">
                <h3>Exercise History</h3>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Max Weight</th>
                      <th>Sets</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...progressData].reverse().map((data, index) => (
                      <tr key={index}>
                        <td>{data.date}</td>
                        <td>{data.maxWeight} lbs × {data.maxWeightReps} reps</td>
                        <td>{data.sets}</td>
                        <td>{data.totalVolume} lbs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgressDashboard;