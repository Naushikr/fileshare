import { useNavigate } from 'react-router-dom';
// import socket from './socket'; 
export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    // socket.disconnect()
    navigate('/signin');
  };

  return (
    <div style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
      <h3>My App</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
