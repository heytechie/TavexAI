'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Home() {
  const {
    user,
    loading,
    sidebarOpen,
    showLogoutModal,
    fetchCurrentUser,
    loginWithGoogle,
    logout,
    toggleSidebar,
    setShowLogoutModal,
    setSidebarOpen
  } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <div className="flex h-screen w-full bg-[#0d0e15] text-zinc-100 font-sans overflow-hidden selection:bg-purple-600 selection:text-white relative">
      {/* SIDEBAR WITH LOGIN FEATURE */}
      <aside
        className={`${sidebarOpen ? 'w-64 sm:w-72' : 'w-0'
          } transition-all duration-300 bg-[#12131c] border-r border-zinc-800/70 flex flex-col justify-between shrink-0 relative overflow-hidden z-20`}
      >
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              T
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              TavexAI
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              free
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Toggle sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Sidebar Login / User Profile Area */}
        <div className="p-4 border-t border-zinc-800/70 bg-[#0e0f17]">
          {user ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-white truncate">{user.name || user.email || 'User'}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Logged in</span>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-zinc-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Log out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue With Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-[#0d0e15]">
        {!sidebarOpen && (
          <button
            onClick={() => {
              setSidebarOpen(true);
            }}
            className="absolute top-4 left-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors z-30 cursor-pointer"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs bg-[#161722] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center text-xl">
              ⚠️
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Sign Out?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to log out of TavexAI?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
