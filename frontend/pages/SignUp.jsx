import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'groupA', // default role
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace this URL with your backend signup endpoint
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/signup`, formData);
      alert('Signup successful!');
      console.log(response.data);
      navigate('/signin')
    } catch (error) {
      console.error(error);
      alert('Signup failed!');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div>
          <label>Role:</label><br />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="groupA">Group A</option>
            <option value="groupB">Group B</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Sign Up</button>
      </form>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Already a member?</span>
        <Link to="/signin">
          <button>Sign in</button>
        </Link>
      </div>
    </div>
  );
}
