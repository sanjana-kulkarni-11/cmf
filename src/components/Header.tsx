import React, { useState } from 'react';
import { User } from '../types';
import { COLLEGE_INFO } from '../data/mockDatabase';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  FileSpreadsheet,
  Database,
  Building2,
  Check,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenERDiagram: () => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenERDiagram,
  onResetData,
  onLogout
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const admins = allUsers.filter(u => u.role === 'admin');

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-blue-900/40">
      {/* Top institutional strip */}
      <div className="bg-black/30 border-b border-white/5 py-1 px-4 sm:px-6 text-[11px] text-blue-200/90 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-300">ESTD 1957</span>
          <span className="text-slate-400">•</span>
          <span>{COLLEGE_INFO.naac}</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline">{COLLEGE_INFO.affiliation}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MongoDB Database: Active</span>
          </div>
          <span className="text-slate-500">|</span>
          <button
            onClick={onOpenERDiagram}
            className="hover:text-blue-300 transition-colors flex items-center gap-1 font-medium text-blue-300"
          >
            <Database className="w-3.5 h-3.5" />
            <span>MERN ER Schema</span>
          </button>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* College Logo / Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400 font-extrabold text-sm tracking-wider">
              KLE
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
                {COLLEGE_INFO.institution}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-600/60 text-blue-100 rounded font-semibold uppercase">
                Autonomous
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{COLLEGE_INFO.name}</span>
              <span className="text-xs font-normal text-slate-300 hidden md:inline">Hubballi - 580031</span>
            </h1>
            <p className="text-xs text-blue-200/80 font-medium">
              Smart College Management System • {COLLEGE_INFO.department} (2026-27)
            </p>
          </div>
        </div>

        {/* Right side controls: Role Switcher & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-inner"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  Active Role
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-400'
                        : currentUser.role === 'teacher'
                        ? 'bg-purple-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </span>
                <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-[170px]">
                  {currentUser.name}
                </span>
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : currentUser.role === 'teacher'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {currentUser.role}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                  <span>Switch Demo User</span>
                  <span className="text-[10px] text-blue-600 font-normal">Single-Click Switch</span>
                </div>

                {/* Admins */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-amber-700 uppercase">
                  Administrator
                </div>
                {admins.map(adm => (
                  <button
                    key={adm.id}
                    onClick={() => {
                      onSelectUser(adm);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{adm.name}</p>
                      <p className="text-[10px] text-slate-500">{adm.designation}</p>
                    </div>
                    {currentUser.id === adm.id && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                ))}

                {/* Faculty Guides */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-purple-700 uppercase border-t border-slate-100 mt-1">
                  Faculty Guides (BCA)
                </div>
                {teachers.map(tch => (
                  <button
                    key={tch.id}
                    onClick={() => {
                      onSelectUser(tch);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{tch.name}</p>
                      <p className="text-[10px] text-purple-700">{tch.staffId} • {tch.designation}</p>
                    </div>
                    {currentUser.id === tch.id && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}

                {/* Student Authors */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-emerald-700 uppercase border-t border-slate-100 mt-1">
                  Student Team (BCA Sem V)
                </div>
                {students.map(stu => (
                  <button
                    key={stu.id}
                    onClick={() => {
                      onSelectUser(stu);
                      setDropdownOpen(false);
                    }}
                    className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">{stu.name}</span>
                        {stu.rollNo === '224048' && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">Author</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">Roll: {stu.rollNo} • Sem V</p>
                    </div>
                    {currentUser.id === stu.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}

                <div className="p-2 border-t border-slate-100 mt-1 space-y-1">
                  {onLogout && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-center font-bold transition-colors flex items-center justify-center gap-1.5 text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch Account / Sign In Page</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Reset all local database tables to initial 2026-27 seed records?")) {
                        onResetData();
                        setDropdownOpen(false);
                      }
                    }}
                    className="w-full py-1.5 px-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded text-center font-medium transition-colors flex items-center justify-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data to Initial State</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out / Switch Account"
              className="p-2.5 bg-slate-800/80 hover:bg-rose-600/30 hover:text-rose-300 text-slate-300 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
