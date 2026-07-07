import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 text-white relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <nav className="border-b border-dark-800 bg-dark-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">H</span>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-300">Helpdesk AI</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-dark-200 border border-dark-700/50 transition duration-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>

          <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-200">
            Welcome to AI Helpdesk, {user?.name}!
          </h1>
          <p className="text-dark-400 mb-8 text-lg">
            This is Phase 1 Foundation: Authentication & User Roles configuration.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-900/60 border border-dark-800/80 p-6 rounded-2xl flex flex-col gap-3">
              <User className="text-primary-400 h-8 w-8" />
              <div>
                <div className="text-xs text-dark-500 uppercase tracking-wider font-semibold">Name</div>
                <div className="text-white font-medium text-lg mt-0.5">{user?.name}</div>
              </div>
            </div>

            <div className="bg-dark-900/60 border border-dark-800/80 p-6 rounded-2xl flex flex-col gap-3">
              <Mail className="text-indigo-400 h-8 w-8" />
              <div>
                <div className="text-xs text-dark-500 uppercase tracking-wider font-semibold">Email</div>
                <div className="text-white font-medium text-lg mt-0.5">{user?.email}</div>
              </div>
            </div>

            <div className="bg-dark-900/60 border border-dark-800/80 p-6 rounded-2xl flex flex-col gap-3">
              <ShieldAlert className="text-purple-400 h-8 w-8" />
              <div>
                <div className="text-xs text-dark-500 uppercase tracking-wider font-semibold">Assigned Role</div>
                <div className="text-white font-medium text-lg mt-0.5 capitalize">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
