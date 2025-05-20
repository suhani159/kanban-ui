import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<KanbanBoard/>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
