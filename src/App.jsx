import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import GraphView from './components/GraphView';
import About from './components/About';

const App = () => {
  return (
    <Router>
      <DataProvider>
        <div className="flex flex-col h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<GraphView />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </DataProvider>
    </Router>
  );
};

export default App;