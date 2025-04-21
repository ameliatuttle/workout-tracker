// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          WorkoutTracker
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
            My Workouts
          </NavLink>
          <NavLink to="/progress" className={({isActive}) => isActive ? 'active' : ''}>
            Progress
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;