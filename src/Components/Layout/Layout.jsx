import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiLogOut } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { tokenStore } from '../../services/apiClient';
import { authApi, notificationsApi } from '../../services/api';

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(tokenStore.getUser());
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    authApi.me().then((u) => {
      if (u) {
        setUser(u);
        tokenStore.set({ user: u });
      }
    }).catch(() => null);
    notificationsApi.list({ unread: true, limit: 1 })
      .then((res) => setUnread(res?.totalUnread || res?.unreadCount || 0))
      .catch(() => setUnread(0));
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = tokenStore.getRefresh();
      if (refresh) await authApi.logout(refresh).catch(() => null);
    } finally {
      tokenStore.clear();
      navigate('/auth', { replace: true });
    }
  };

  const displayName = user?.name || user?.username || 'Admin';

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-100 flex-shrink-0">
          <div className="relative w-72 sm:w-96">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input type="text" placeholder="Search sections or content..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-[#d26c51] focus:border-transparent outline-none transition-all text-sm" />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-[#235056] transition-colors" aria-label="Notifications">
              <FiBell className="text-2xl" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#d26c51] rounded-full border-2 border-white text-[10px] text-white font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="text-sm font-medium text-[#235056] flex items-center gap-2">
              <span className="text-gray-400 font-normal">Welcome back, </span>
              {displayName}
            </div>

            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 transition-colors">
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
