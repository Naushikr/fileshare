import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URI);

export default function GroupADashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [category1, setCategory1] = useState('');
  const [category2, setCategory2] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  const fetchSubmissions = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/my-submissions/${user.id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) socket.connect();

    socket.on('status-updated', (updatedSubmission) => {
      setSubmissions(prevSubs =>
        prevSubs.map(sub =>
          sub._id === updatedSubmission._id ? updatedSubmission : sub
        )
      );
    });

    return () => {
      socket.off('status-updated');
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !category1 || !category2) {
      alert("File and categories are required");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', message);
    formData.append('userId', user.id);
    formData.append('category1', category1);
    formData.append('category2', category2);

    try {
      setIsSubmitting(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/submit-file`, formData);
      alert("Submitted!");
      setFile(null);
      setMessage('');
      setCategory1('');
      setCategory2('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>User not found. Please log in again.</h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Welcome, {user.name} (Group A)</h2>

        {/* -------- Section 1: Table -------- */}
        <h3>Your Sent Files</h3>
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '2rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Status</th>
              <th>Updated By</th>
              <th>Category 1</th>
              <th>Category 2</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub._id}</td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_BACKEND_URI}/uploads/${sub.fileName}`}
                      rel="noopener noreferrer"
                      download={sub.fileName}
                      target='_blank'
                    >
                      {sub.fileName}
                    </a>
                  </td>
                  <td>{sub.status}</td>
                  <td>{sub.updatedBy || '-'}</td>
                  <td>{sub.category1}</td>
                  <td>{sub.category2}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No files submitted yet</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* -------- Section 2: Upload Form -------- */}
        <h3>Submit a New File</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>File:</label><br />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Message:</label><br />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Category 1:</label><br />
            <select value={category1} onChange={(e) => setCategory1(e.target.value)}>
              <option value="">Select</option>
              <option value="Category1-A">Category1-A</option>
              <option value="Category1-B">Category1-B</option>
              <option value="Category1-C">Category1-C</option>
              <option value="Category1-D">Category1-D</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Category 2:</label><br />
            <select value={category2} onChange={(e) => setCategory2(e.target.value)}>
              <option value="">Select</option>
              <option value="Category2-X">Category2-X</option>
              <option value="Category2-Y">Category2-Y</option>
              <option value="Category2-Z">Category2-Z</option>
              <option value="Category2-W">Category2-W</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: '1rem' }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
