import Header from "./pages/Header";
import Login from "./pages/Login"
import Admin from "./pages/Table";
import Fetch from "./pages/Fetch";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Header></Header>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/fetch" element={<Fetch/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;