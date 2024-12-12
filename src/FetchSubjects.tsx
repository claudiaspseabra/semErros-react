import { useState, useEffect } from 'react';

interface Subject {
  subjectId: number;
  subjectName: string;
  courseId: number;
  studentsEnrolled: number;
  subjectEvaluationType: string;
  subjectAttendance: string;
  subjectYear: number;
  subjectSemester: number;
}

interface FetchProps {
  onFetchComplete: (subjects: { value: number; course: number; year: number; semester: number; label: string }[]) => void;
}

const Fetch: React.FC<FetchProps> = ({ onFetchComplete }) => {
  useEffect(() => {
    fetch("http://localhost:8080/app/subjects")
      .then((res) => res.json())
      .then((data) => {
        const formattedSubjects = (Array.isArray(data) ? data : [data]).map(
          (subject: Subject) => ({
            value: subject.subjectId,
            course: subject.courseId,
            year: subject.subjectYear,
            semester: subject.subjectSemester,
            label: subject.subjectName,
          })
        );
        onFetchComplete(formattedSubjects);
      })
      .catch((error) => console.error("Error:", error));
  }, [onFetchComplete]);

  return null;
};

export default Fetch;