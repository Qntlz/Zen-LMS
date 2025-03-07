"use client";
"use client";
import { useEffect, useState } from 'react';

interface Assignment {
  id: number;
  name: string;
  due_at: string;
}

export default function AssignmentsList({ courseId }: { courseId: number }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Fetch credentials from the server
        const authResponse = await fetch('/api/auth');
        if (!authResponse.ok) {
          throw new Error('No credentials found');
        }
        const { canvasUrl, apiToken } = await authResponse.json();

        // Fetch assignments using server credentials
        const response = await fetch(`/api/assignments?courseId=${courseId}`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        if(error instanceof Error){
            setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [courseId]);

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">HWB Course Assignments</h3>
            {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border rounded-lg">
                    <h4>{assignment.name}</h4>
                    <p>Id: {assignment.id}</p>
                    <p>
                        Due: {new Date(assignment.due_at).toLocaleString("en-US", {
                            timeZone: "Asia/Manila",
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>

                </div>
            ))}
        </div>
    );
}