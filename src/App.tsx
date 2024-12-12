import Header from "./Header";
import Login from "./Login"
import Admin from "./Admin";
import FetchClassrooms from "./FetchClassrooms";
import FetchCourses from "./FetchCourses";
import FetchSubjects from "./FetchSubjects";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Header></Header>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/classrooms" element={<FetchClassrooms/>}/>
        <Route path="/courses" element={<FetchCourses/>}/>
        <Route path="/subjects" element={<FetchSubjects/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;