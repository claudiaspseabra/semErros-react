import { useState, useEffect } from 'react';

interface Course {
  courseName: string;
  courseDuration: number;
  courseId: number;
}

const Fetch: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  /*
  useEffect(() => {
    fetch('http://localhost:8080/app/courses/1')
      .then((res) => res.json())
      .then((data: Course[]) => {
        console.log(data);
        setCourses(data);
      })
      .catch(error => console.error("Error: ", error));
  }, []); */

  useEffect(() => {
    fetch('http://localhost:8080/app/courses/2')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([data]); // Coloca o objeto em um array para consistência
        }
      })
      .catch(error => console.error("Error: ", error));
  }, []);

  return (
      courses.map((course) => (
      <h1>{course.courseName + "," + course.courseDuration}</h1>   
      ))
  )
}

export default Fetch;