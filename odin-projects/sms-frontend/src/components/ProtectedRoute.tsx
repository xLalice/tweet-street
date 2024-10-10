import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { verifyAuth } from '../services/api';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the ClipLoader

const ProtectedRoute: React.FC<{ setShowNavbar: (show: boolean) => void }> = ({ setShowNavbar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verifyAuth();
        setIsAuthenticated(result.authenticated);
        setShowNavbar(result.authenticated);
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setIsAuthenticated(false);
        setShowNavbar(false);
      }
    };

    checkAuth();
  }, [setShowNavbar]);

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#3498db" loading={true} size={50} /> {/* Spinner */}
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
