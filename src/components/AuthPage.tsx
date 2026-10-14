import React, { useState } from 'react';
import { User } from '../types';
import { ApiService } from '../utils/api';
import { COLLEGE_INFO, INITIAL_USERS } from '../data/mockDatabase';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Database,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  availableUsers: User[];
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, availableUsers }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Form
  const [loginEmailOrId, setLoginEmailOrId] = useState('sanjanakulkarni11092006@gmail.com');
  const [loginPassword, setLoginPassword] = useState('pcjabin123');

  // Register Form
  const [registerRole, setRegisterRole] = useState<'student' | 'teacher'>('student');
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [regNo, setRegNo] = useState('');
  const [semester, setSemester] = useState(5);
  const [section, setSection] = useState('A');
  const [guardianName, setGuardianName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [qualification, setQualification] = useState('M.Tech (CSE) / MCA');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await ApiService.login(loginEmailOrId, loginPassword);
      if (res && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      // Local fallback lookup
      const found = availableUsers.find(
        u =>
          u.email.toLowerCase() === loginEmailOrId.trim().toLowerCase() ||
          (u.rollNo && u.rollNo.toLowerCase() === loginEmailOrId.trim().toLowerCase()) ||
          (u.staffId && u.staffId.toLowerCase() === loginEmailOrId.trim().toLowerCase())
      );
      if (found) {
        onLoginSuccess(found);
      } else {
        setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login
  const handleQuickLogin = (demoUser: User) => {
    onLoginSuccess(demoUser);
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (registerPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (registerPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: fullName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
        phone: phone || '+91 94480 00000',
        department: 'Bachelor of Computer Application (BCA)',
        ...(registerRole === 'student'
          ? {
              rollNo: rollNo || `${224000 + Math.floor(10 + Math.random() * 89)}`,
              regNo: regNo || `U15JC24S00${Math.floor(10 + Math.random() * 89)}`,
              semester,
              section,
              guardianName: guardianName || 'Parent Guardian',
              bloodGroup: 'O+',
              address: 'Deshpande Nagar, Hubballi'
            }
          : {
              staffId: staffId || `KLE-BCA-${Math.floor(100 + Math.random() * 899)}`,
              designation,
              qualification,
              experience: '5+ Years',
              specialization: ['Full Stack Web Development', 'Database Management']
            })
      };

      const res = await ApiService.register(payload);
      setSuccessMessage('Account registered and document stored in MongoDB database!');
      setTimeout(() => {
        if (res && res.user) {
          onLoginSuccess(res.user);
        }
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* College Institutional Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/15 border border-amber-400/30 rounded-full text-xs text-amber-300 font-semibold tracking-wider uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ESTD 1957 • Autonomous Institution</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          {COLLEGE_INFO.institution}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-black text-blue-200 tracking-wide">
          {COLLEGE_INFO.name}, <span className="text-amber-400">{COLLEGE_INFO.status}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          ({COLLEGE_INFO.affiliation}) • {COLLEGE_INFO.location}
        </p>
        <p className="text-xs text-amber-300/80 font-mono">
          {COLLEGE_INFO.naac}
        </p>
      </div>

      {/* Main Auth Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header Bar with Database Status */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm">Smart College Management Portal</h3>
              <p className="text-[11px] text-slate-400">Department of BCA • 2026-27</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MongoDB Connected</span>
            </div>
          </div>

          {/* Tab Selector: Login vs Register */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3.5 text-center transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-3.5 text-center transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Register New Account (Save to DB)
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Error & Success Banners */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email Address, Roll Number or Staff ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginEmailOrId}
                      onChange={e => setLoginEmailOrId(e.target.value)}
                      placeholder="e.g. sanjanakulkarni11092006@gmail.com or 224048"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Password</label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: pcjabin123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating with MongoDB...' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick 1-Click Demo Logins for Examiner / Student */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Quick Demo Profile Switcher
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">1-Click Sign In</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(INITIAL_USERS[4])}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors"
                    >
                      <span className="text-[10px] uppercase font-bold text-emerald-800 block">Student Author</span>
                      <p className="font-bold text-slate-900 text-xs">Sanjana Kulkarni</p>
                      <p className="text-[10px] text-slate-500 font-mono">Roll: 224048</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin(INITIAL_USERS[1])}
                      className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition-colors"
                    >
                      <span className="text-[10px] uppercase font-bold text-purple-800 block">Project Guide</span>
                      <p className="font-bold text-slate-900 text-xs">Prof. Sampada S</p>
                      <p className="text-[10px] text-slate-500 font-mono">Staff: BCA-104</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin(INITIAL_USERS[0])}
                      className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-colors"
                    >
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">Administrator</span>
                      <p className="font-bold text-slate-900 text-xs">Dr. L. D. Horakeri</p>
                      <p className="text-[10px] text-slate-500 font-mono">Principal</p>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Select Role *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('student')}
                      className={`py-2 text-center rounded-lg font-bold border transition-colors ${
                        registerRole === 'student'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      BCA Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('teacher')}
                      className={`py-2 text-center rounded-lg font-bold border transition-colors ${
                        registerRole === 'teacher'
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Faculty Member
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={e => setRegisterEmail(e.target.value)}
                      placeholder="e.g. ramesh@pcjabin.edu.in"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={e => setRegisterPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Role specific inputs */}
                {registerRole === 'student' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Roll Number *</label>
                        <input
                          type="text"
                          required
                          value={rollNo}
                          onChange={e => setRollNo(e.target.value)}
                          placeholder="e.g. 224065"
                          className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Reg Number *</label>
                        <input
                          type="text"
                          required
                          value={regNo}
                          onChange={e => setRegNo(e.target.value)}
                          placeholder="U15JC24S0065"
                          className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Semester</label>
                        <select
                          value={semester}
                          onChange={e => setSemester(Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded-xl"
                        >
                          {[1, 2, 3, 4, 5, 6].map(s => (
                            <option key={s} value={s}>
                              Semester {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+91 94480 00000"
                          className="w-full p-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Guardian Name</label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={e => setGuardianName(e.target.value)}
                          placeholder="Parent / Guardian"
                          className="w-full p-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Staff ID *</label>
                      <input
                        type="text"
                        required
                        value={staffId}
                        onChange={e => setStaffId(e.target.value)}
                        placeholder="e.g. KLE-BCA-120"
                        className="w-full p-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        placeholder="Assistant Professor"
                        className="w-full p-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Qualification</label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={e => setQualification(e.target.value)}
                        placeholder="MCA / M.Tech"
                        className="w-full p-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
                  <strong>MongoDB Persistence:</strong> On clicking register, this document will be written directly to the <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">users</code> collection in MongoDB, and an academic fee ledger will be automatically linked.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  <span>{loading ? 'Creating MongoDB Document...' : 'Complete Registration & Store in DB'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-400 mt-6">
          K.L.E. Society's P.C. Jabin Science College, Hubballi - 580031 • BCA 2026-27 Project
        </p>
      </div>
    </div>
  );
};
