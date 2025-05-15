import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Signin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/signin', formData);
      const { user } = response.data;

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'groupA') {
        navigate('/group-a-dashboard');
      } else if (user.role === 'groupB') {
        navigate('/group-b-dashboard');
      }

    } catch (error) {
      console.error(error);
      alert('Sign in failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Sign in</button>
      </form>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Don't have an account?</span>
        <Link to="/signup">
          <button>Sign up</button>
        </Link>
      </div>

    </div>
  );
}
