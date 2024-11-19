import Header from "./pages/Header";
import Login from "./pages/Login"
import Admin from "./pages/Table";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Header></Header>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;