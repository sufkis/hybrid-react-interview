import React from 'react';
import './App.css';
import { Dashboard } from './components/dashboard/Dashboard';
import { AppHeader } from './components/app-header/AppHeader';

function App() {
  return (
    <div className="app">
      <AppHeader />
      <Dashboard />
    </div>
  );
}

export default App;
