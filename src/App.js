// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import WorkoutDetail from './components/WorkoutDetail';
import ProgressDashboard from './components/ProgressDashboard';

function App() {
  const [workouts, setWorkouts] = useState([]);

  // Load saved workouts from localStorage on initial render
  useEffect(() => {
    console.log('Loading workouts from localStorage...');
    const savedWorkouts = localStorage.getItem('workouts');
    console.log('Saved workouts found:', savedWorkouts);
    if (savedWorkouts) {
      const parsedWorkouts = JSON.parse(savedWorkouts);
      if (parsedWorkouts && parsedWorkouts.length > 0) {
        setWorkouts(parsedWorkouts);
      }
    }
  }, []);

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    if (workouts) {
      console.log('Saving workouts to localStorage:', workouts);
      localStorage.setItem('workouts', JSON.stringify(workouts));
    }
  }, [workouts]);

  // Add a new workout
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setWorkouts([...workouts, newWorkout]);
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<WorkoutList workouts={workouts} />} />
            <Route path="/add" element={<WorkoutForm addWorkout={addWorkout} />} />
            <Route path="/workout/:id" element={<WorkoutDetail workouts={workouts} setWorkouts={setWorkouts} />} />
            <Route path="/progress" element={<ProgressDashboard workouts={workouts} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;