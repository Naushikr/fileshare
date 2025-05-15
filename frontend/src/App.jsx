import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import GroupADashboard from '../pages/GroupADashboard';
import GroupBDashboard from '../pages/GroupBDashboard';
import PrivateRoute from '../components/PrivateRoute';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/group-a-dashboard" element={
    <PrivateRoute>
      <GroupADashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/group-b-dashboard"
  element={
    <PrivateRoute>
      <GroupBDashboard />
    </PrivateRoute>
  }
/>
     
    </Routes>
    
    
  );
}

export default App;
