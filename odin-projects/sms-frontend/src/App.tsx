import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OAuthLogin from "./components/auth/OAuthLogin";
import CalendarView from "./components/Calendar";
import PostForm from "./components/PostForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AuthCallback from './components/AuthCallback';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <Router>
      {showNavbar && <Navbar setShowNavbar={setShowNavbar}/>} 

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<OAuthLogin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute setShowNavbar={setShowNavbar} />}>
          <Route path="/" element={<CalendarView />} />
          <Route path="/create-post" element={<PostForm />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
