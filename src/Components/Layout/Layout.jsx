import React from 'react';
import { Outlet } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import Sidebar from './Sidebar'; 

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* 1. Left Sidebar (Fixed to the left with actual spec routes) */}
      <Sidebar />

      {/* 2. Right Side (Topbar + Main Content) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Topbar Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-100 flex-shrink-0">
          
          {/* Global Search Bar */}
          <div className="relative w-72 sm:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search sections or content..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-[#d26c51] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-[#235056] transition-colors">
              <FiBell className="text-2xl" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#d26c51] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="text-sm font-medium text-[#235056]">
              <span className="text-gray-400 font-normal">Welcome back, </span>
              Admin
            </div>
          </div>
        </header>

        {/* Main Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 sm:p-8">
          
          {/* This renders the specific admin page (e.g., Site Config, Services) */}
          <Outlet />
          
        </main>
        
      </div>
    </div>
  );
};

export default Layout;