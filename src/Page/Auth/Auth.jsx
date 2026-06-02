import React from 'react';
import AuthForm from '../../Components/Auth/AuthForm';

const Auth = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-50 font-sans overflow-hidden p-4 sm:p-8">
      
      {/* Ambient Background Orbs (Mesh Gradient Effect) */}
      {/* Primary Teal Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#235056] rounded-full mix-blend-multiply filter blur-[150px] opacity-20"></div>
      {/* Secondary Orange Orb */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d26c51] rounded-full mix-blend-multiply filter blur-[150px] opacity-20"></div>
      {/* Tertiary Yellow/Peach Orb */}
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-[#f2c695] rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>

      {/* Subtle Dotted Grid Overlay */}
      {/* <div className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:30px_30px] opacity-40"></div> */}

      {/* Centered Form Container */}
      <div className="relative z-10 w-full max-w-xl transform transition-all duration-500 hover:scale-[1.01]">
        {/* The AuthForm component is placed directly here. 
          It already handles its own white background, padding, and shadow.
        */}
        <AuthForm />
      </div>

    </div>
  );
}

export default Auth;