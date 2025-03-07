"use client"

import { useState, useEffect } from "react";

interface Course {
  id: number;
  name: string;
  term: {
    name: string;
  };
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch credentials from the server
        const authResponse = await fetch('/api/auth');
        if (!authResponse.ok) {
          throw new Error('No credentials found');
        }
        const { canvasUrl, apiToken } = await authResponse.json();

        // Fetch courses using server credentials
        const response = await fetch(`/api/course`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading Courses...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Currently Enrolled Courses</h3>
        {courses.map((course) =>
          course.term.name !== "Default Term" && (
            <div key={course.id} className="p-4 border rounded-lg">
              <h4>{course.name}</h4>
              <p>ID: {course.id}</p>
              <p>Term: {course.term.name}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}