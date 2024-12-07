import { useState, useEffect } from 'react';

interface User {
  classroomId: number;
  tag: string;
  description: string;
  classroomType: string;
  capacity: number;
  evaluationIds: Array<number>;
  classroomInUseDate: Date;
}

const Fetch: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/app/classrooms')
      .then((res) => res.json())
      .then((data: User[]) => {
        console.log(data);
        setUsers(data);
      })
      .catch(error => console.error("Error: ", error));
  }, []);

  return (
    <div>
      <h1>hello</h1>
      {users.map((user) => (
        <h1>{user.classroomId + "," + user.tag + "," + user.description + "," + user.capacity}</h1>
      ))}
    </div>
  );
};

export default Fetch;