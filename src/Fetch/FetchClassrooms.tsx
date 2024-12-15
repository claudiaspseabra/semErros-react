import { useEffect } from 'react';

interface Classroom {
  classroomId: number;
  tag: string;
  description: string;
  classroomType: string;
  capacity: number;
  evaluationIds: Array<number>;
  classroomInUseDate: Date;
}

interface FetchProps {
  onFetchComplete: (classrooms: { value: number; label: string }[]) => void;
}

const Fetch: React.FC<FetchProps> = ({ onFetchComplete }) => {
  useEffect(() => {
    fetch('http://localhost:8080/app/classrooms')
      .then((res) => res.json())
      .then((data) => {
        const formattedClassrooms = (Array.isArray(data) ? data : [data]).map(
          (classroom: Classroom) => ({
            value: classroom.classroomId,
            label: classroom.description,
          })
        );
        onFetchComplete(formattedClassrooms);
      })
      .catch((error) => console.error('Error: ', error));
  }, [onFetchComplete]);

  return null;
};

export default Fetch;