import { useState, useEffect } from 'react';

interface Classroom {
  classroomId: number;
  tag: string;
  description: string;
  classroomType: string;
  capacity: number;
  evaluationIds: Array<number>;
  classroomInUseDate: Date;
}

const Fetch: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/app/classrooms')
      .then((res) => res.json())
      .then((data: Classroom[]) => {
        console.log(data);
        setClassrooms(data);
      })
      .catch(error => console.error("Error: ", error));
  }, []);

  return (
      classrooms.map((classroom) => (
        <>{classroom.tag}</>
      ))
  )
}

export default Fetch;