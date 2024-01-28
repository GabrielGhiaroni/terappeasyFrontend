import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import MinhasNotas from './Components/Notas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/minhas-notas/:id" element={<MinhasNotas />} />
      </Routes>
    </Router>
  );
}

export default App;
