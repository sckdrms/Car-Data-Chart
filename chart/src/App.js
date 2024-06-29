import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import P404 from './components/404Components';
import ReactFullpage from './components/FullpageComponent';

import MainComponent from './components/MainComponents';
import LoginComponent from './components/LoginComponent';
import DetailComponent from './components/DetailComponents';
import RoadComponent from './components/RoadComponents';
import CollisionComponent from './components/CollisionComponents';
import DriverScoreComponent, { DriverScoreContext } from './components/DetailComponents/8DriverScoreComponents';
import AverageScoreComponent from './components/DetailComponents/9AverageScoreComponents';

import React, { useState } from 'react';

function App() {
  const [scores, setScores] = useState([]);

  return (
    <Router>
      <AuthProvider>
        <DriverScoreContext.Provider value={{ scores, setScores }}>
          <div className="App">
            <Routes>
              <Route path='/' element={<ReactFullpage />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/road" element={<RoadComponent />} />
              <Route path="/main" element={<MainComponent />} />
              <Route path="/detail" element={<DetailComponent />} />
              <Route path="/collision" element={<CollisionComponent />} />
              <Route path="/driver-score" element={<DriverScoreComponent />} />
              <Route path="/average-score" element={<AverageScoreComponent />} />
              <Route path='*' element={<P404 />} />
            </Routes>
          </div>
        </DriverScoreContext.Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
