import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to the File Submission & Review Platform</h1>
      <p>
        Group A users can upload files and check the status. <br />
        Group B users can review and manage submissions.
      </p>
      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
        <Link to="/signup" style={{ marginLeft: "1rem" }}>
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
