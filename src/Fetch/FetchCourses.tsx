import { useEffect } from "react";

interface Course {
  courseName: string;
  courseDuration: number;
  courseId: number;
}

interface FetchProps {
  onFetchComplete: (courses: { value: number; label: string }[]) => void;
}

const Fetch: React.FC<FetchProps> = ({ onFetchComplete }) => {
  useEffect(() => {
    fetch("http://localhost:8080/app/courses")
      .then((res) => res.json())
      .then((data) => {
        const formattedCourses = (Array.isArray(data) ? data : [data]).map(
          (course: Course) => ({
            value: course.courseId,
            label: course.courseName,
          })
        );
        onFetchComplete(formattedCourses);
      })
      .catch((error) => console.error("Error:", error));
  }, [onFetchComplete]);

  return null;
};

export default Fetch;