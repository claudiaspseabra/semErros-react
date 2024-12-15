import Header from './Header';
import Login from './Login';
import Admin from './Admin';
import User from './User';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Header></Header>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/admin/:id" element={<Admin/>}/>
        <Route path="/user/:id" element={<User/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;