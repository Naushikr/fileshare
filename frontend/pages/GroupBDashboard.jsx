import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URI);

export default function GroupBDashboard() {
  const user = JSON.parse(localStorage.getItem('user')); // Group B user
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await axios.get("${import.meta.env.VITE_BACKEND_URI}/api/all-submissions");
        const submissionsData = Array.isArray(res.data) ? res.data : res.data.submissions || [];
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    }
    fetchSubmissions();
  }, []);
  
 
  useEffect(() => {
    socket.on('new-submission', (data) => {
      setSubmissions((prev) => {
              const exists = prev.some(sub => sub._id === data._id);
              if (exists) return prev;
              return [data, ...prev];
            });
    });
  
    socket.on('status-updated', (updatedSubmission) => {
      setSubmissions(prev =>
        prev.map(sub => sub._id === updatedSubmission._id ? updatedSubmission : sub)
      );
    });
  
    return () => {
      socket.off('new-submission');
      socket.off('status-updated');
    };
  }, []);
  
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/update-status/${id}`, {
        status,
        updatedBy: user.name, // Send the user ID or name
      });

      setSubmissions(submissions.map(sub => 
        sub._id === id ? res.data : sub
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Welcome, {user.name} (Group B)</h2>
      <p>You can review and take action on submitted files.</p>

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>S.no</th>
            <th>File</th>
            <th>Sender Name</th>
            <th>Category 1 </th>
            <th>Category 2 </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(submissions) && submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <tr key={submission._id}>
                <td>{index + 1}</td>
                <td>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URI}/uploads/${submission.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {submission.fileName}
                  </a>
                </td>
                <td>{submission.sender_name}</td>
                <td>{submission.category1} </td>
                <td>{submission.category2} </td>
                <td>
  {submission.status === "submitted" ? (
    <>
      <button onClick={() => updateStatus(submission._id, "accepted")}>Accept</button>
      <button onClick={() => updateStatus(submission._id, "denied")}>Deny</button>
    </>
  ) : (
    submission.status
  )}
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No Submissions Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}