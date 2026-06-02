import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiSmartphone, FiLock, FiArrowLeft } from 'react-icons/fi';
import { HiVariable } from 'react-icons/hi';

const AuthForm = () => {
  // State to toggle between 'password' and 'otp' modes
  const [loginMethod, setLoginMethod] = useState('password'); 
  const [verificationSent, setVerificationSent] = useState(false); // To track if OTP has been sent

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
      
      {/* Header & Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src="/logo.avif" 
          alt="Kraviona Logo" 
          className="w-16 h-16 mb-4 object-contain" 
        />
        <h1 className="text-3xl font-extrabold text-[#235056] uppercase tracking-wider">
          Kraviona
        </h1>
        <p className="text-center text-gray-500 mt-2 text-sm">
          {verificationSent 
            ? "Please enter the OTP sent to your device." 
            : "Welcome back! Please enter your details."}
        </p>
      </div>

      {verificationSent ? (
        // --- OTP VERIFICATION VIEW ---
        <div className="space-y-5 animate-fade-in">
          <div>
            <label className="block text-sm font-semibold text-[#235056] mb-1.5 text-center">
              Enter 6-Digit OTP
            </label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="••••••" 
              className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-[0.5em] text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#d26c51] focus:border-transparent transition-all" 
            />
          </div>
          
          <button className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md">
            Verify & Login
          </button>

          <div className="flex justify-center mt-4">
            <button 
              onClick={() => setVerificationSent(false)}
              className="text-sm font-semibold text-[#d26c51] hover:text-[#b65840] transition-colors flex items-center gap-1"
            >
              <FiArrowLeft /> Back to login methods
            </button>
          </div>
        </div>
      ) : (
        // --- STANDARD LOGIN VIEW ---
        <div>
          {/* Conditional Auth Form Fields */}
          {loginMethod === 'password' ? (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51] focus:border-transparent transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51] focus:border-transparent transition-all" 
                />
              </div>
              
              <div className="flex justify-end">
                <button className="text-sm font-semibold text-[#d26c51] hover:text-[#b65840] transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md">
                Login
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-[#235056] mb-1.5">
                  Email ID or Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your Email ID or mobile number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d26c51] focus:border-transparent transition-all"
                />
              </div>
              <button 
                onClick={() => setVerificationSent(true)} // Triggers the view change
                className="w-full bg-[#235056] text-white p-3 rounded-lg font-bold text-lg hover:bg-[#1a3d42] transition-colors shadow-md"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Alternative Login Methods */}
          <div className="space-y-3">
            {/* Dynamic Toggle Button based on current state */}
            {loginMethod === 'password' ? (
              <button 
                onClick={() => setLoginMethod('otp')}
                className="w-full flex items-center justify-center gap-3 border-2 border-[#f2c695] text-[#235056] p-3 rounded-lg font-semibold hover:bg-[#fff9f2] transition-colors"
              >
                <FiSmartphone className="text-xl" />
                Login With OTP
              </button>
            ) : (
              <button 
                onClick={() => setLoginMethod('password')}
                className="w-full flex items-center justify-center gap-3 border-2 border-[#f2c695] text-[#235056] p-3 rounded-lg font-semibold hover:bg-[#fff9f2] transition-colors"
              >
                <FiLock className="text-xl" />
                Login With Password
              </button>
            )}

            {/* Google Login (Always visible) */}
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              <FcGoogle className="text-xl" />
              Login with Google
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default AuthForm;