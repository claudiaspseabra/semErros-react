import Header from "./Header";
import Login from "./Login"
import Admin from "./Admin";


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