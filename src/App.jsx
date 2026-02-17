import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import HowToUse from './pages/HowToUse';
import ScrollToTop from './components/Common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/howToUse' element={<HowToUse/>}/>
      </Routes>
    </Router>
 
  );
}

export default App;
