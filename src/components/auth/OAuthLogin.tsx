import React from 'react';
import Logo from "../../assets/logo.png"

const OAuthLogin: React.FC = () => {

  const handleTwitterLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/twitter`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?nature')" }} />
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-extrabold text-white mb-6 animate-bounce"><img src={Logo} alt="" /></h2>
        <p className="text-lg text-gray-300 mb-4 text-center">Join us to share your thoughts and connect with others!</p>
        <button
          onClick={handleTwitterLogin}
          className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
        >
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.319 7.595a8.028 8.028 0 01-2.355.644 4.093 4.093 0 001.805-2.256 8.205 8.205 0 01-2.605.99A4.1 4.1 0 0014.826 6c-2.27 0-4.112 1.78-4.112 3.96 0 .307.034.605.102.895a11.643 11.643 0 01-8.458-4.27A4.058 4.058 0 001.928 8.4c0 1.086.55 2.043 1.38 2.604-.51-.016-1.048-.155-1.493-.388v.04c0 2.247 1.589 4.121 3.707 4.545a4.152 4.152 0 01-1.092.145c-.267 0-.52-.025-.775-.073.524 1.575 2.042 2.726 3.846 2.758A8.206 8.206 0 010 18.565a11.556 11.556 0 006.29 1.845c7.548 0 11.686-6.251 11.686-11.653 0-.178 0-.354-.007-.53A8.3 8.3 0 0020.319 7.595z" />
            </svg>
            Connect Twitter
          </span>
        </button>
      </div>
    </div>
  );
};

export default OAuthLogin;
