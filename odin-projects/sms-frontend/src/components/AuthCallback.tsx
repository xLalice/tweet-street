import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/');
    } else {
      console.error('No token found');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
