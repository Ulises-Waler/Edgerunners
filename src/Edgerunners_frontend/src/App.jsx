import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';
import { Card } from 'react-bootstrap';



const App = () => {
  return (
    <Router>
      <div>
        <Card className='text-center'>
          <Card.Body>
            <Card.Title>Patrullaje Inteligente</Card.Title>
        </Card.Body>
        </Card>
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/report" element={<IncidentForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
