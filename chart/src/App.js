// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainComponent from './components/MainComponents';
import LoginComponent from './components/LoginComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/main" element={<LoginComponent />} />
          <Route path="/" element={<MainComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
