import { useState, useEffect } from 'react';

interface Subject {
  subjectName: string;
  courseId: number;
  studentsEnrolled: number;
  subjectEvaluationType: string;
  subjectAttendance: string;
  subjectYear: number;
  subjectSemester: number;
}

const Fetch: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/app/subjects')
      .then((res) => res.json())
      .then((data: Subject[]) => {
        console.log(data);
        setSubjects(data);
      })
      .catch(error => console.error("Error: ", error));
  }, []);

  return (
      subjects.map((subject) => (
      <h1>{subject.subjectName + "," + subject.courseId + "," + subject.studentsEnrolled + "," + subject.subjectEvaluationType + "," + subject.subjectAttendance + "," + subject.subjectYear + "," + subject.subjectSemester}</h1>   
      ))
  )
}

export default Fetch;