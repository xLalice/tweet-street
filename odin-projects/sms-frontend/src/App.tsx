import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OAuthLogin from "./components/auth/OAuthLogin";
import CalendarView from "./components/Calendar";
import PostForm from "./components/PostForm";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute
import Navbar from "./components/Navbar";

function App() {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <Router>
      {showNavbar && <Navbar setShowNavbar={setShowNavbar}/>} {/* Conditionally render the navbar */}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<OAuthLogin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute setShowNavbar={setShowNavbar} />}>
          <Route path="/" element={<CalendarView />} />
          <Route path="/create-post" element={<PostForm />} />
          {/* <Route path="/edit-post/:id" element={<PostEditModal post={} onClose={() => setPost(null)} onSave={() => console.log("Post saved!")} />} /> */}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
