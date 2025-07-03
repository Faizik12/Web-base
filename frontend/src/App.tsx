import React from 'react';
import Table from './components/pages/Tables';
import TableVariant from './components/pages/TablesVariant';
import MainPage from './components/pages/Main';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/databases/:databaseId" element={<TableVariant />} />
      </Routes>
    </Router>
  );
}

export default App;
