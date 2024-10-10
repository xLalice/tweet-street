import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api'; 
import Logo from "../assets/logo.png";

const Navbar: React.FC<{ setShowNavbar: (show: boolean) => void }> = ({ setShowNavbar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setShowNavbar(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg  w-full z-99">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">
          <Link to="/"><img src={Logo} alt="" className=' h-20 '/></Link>
        </div>

        <div className="flex space-x-4">
          <Link to="/create-post" className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200">Schedule Post</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
