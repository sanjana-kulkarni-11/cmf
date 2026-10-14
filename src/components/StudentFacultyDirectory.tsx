import React, { useState } from 'react';
import { User } from '../types';
import {
  Users,
  GraduationCap,
  Search,
  UserPlus,
  Phone,
  Mail,
  BookOpen,
  Building,
  CheckCircle,
  X,
  BadgeCheck,
  Shield
} from 'lucide-react';

interface StudentFacultyDirectoryProps {
  currentUser: User;
  users: User[];
  onAddUser: (user: User) => void;
}

export const StudentFacultyDirectory: React.FC<StudentFacultyDirectoryProps> = ({
  currentUser,
  users,
  onAddUser
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newRole, setNewRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [regNo, setRegNo] = useState('');
  const [staffId, setStaffId] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [semester, setSemester] = useState(5);
  const [guardianName, setGuardianName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const filteredUsers = users.filter(u => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.rollNo && u.rollNo.toLowerCase().includes(q)) ||
      (u.regNo && u.regNo.toLowerCase().includes(q)) ||
      (u.staffId && u.staffId.toLowerCase().includes(q))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '+91 99000 00000',
      role: newRole,
      department: 'Bachelor of Computer Application (BCA)',
      ...(newRole === 'student'
        ? {
            rollNo: rollNo || `${224000 + Math.floor(Math.random() * 90)}`,
            regNo: regNo || `U15JC24S00${Math.floor(Math.random() * 90)}`,
            semester,
            section: 'A',
            admissionYear: '2024',
            guardianName: guardianName || 'Parent Guardian',
            bloodGroup
          }
        : {
            staffId: staffId || `KLE-BCA-${Math.floor(100 + Math.random() * 899)}`,
            designation: designation || 'Assistant Professor',
            qualification: qualification || 'M.Tech (CSE) / MCA',
            experience: '5+ Years',
            specialization: ['Computer Applications', 'Web Engineering']
          })
    };

    onAddUser(newUser);
    setIsModalOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setRollNo('');
    setRegNo('');
    setStaffId('');
    setGuardianName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Academic Directory (Students & Faculty)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • P.C. Jabin Science College Autonomous Hubballi
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Student / Faculty</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Roll No, Staff ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterRole === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Members ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('student')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterRole === 'student' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Students ({users.filter(u => u.role === 'student').length})
          </button>
          <button
            onClick={() => setFilterRole('teacher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterRole === 'teacher' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Faculty & Guides ({users.filter(u => u.role === 'teacher').length})
          </button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all relative ${
              user.role === 'student'
                ? 'border-emerald-100 hover:border-emerald-300'
                : user.role === 'teacher'
                ? 'border-purple-100 hover:border-purple-300'
                : 'border-amber-100 hover:border-amber-300'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  user.role === 'student'
                    ? 'bg-emerald-100 text-emerald-800'
                    : user.role === 'teacher'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {user.role === 'student' ? 'BCA Student' : user.role === 'teacher' ? 'Faculty Guide' : 'Administrator'}
              </span>

              {user.rollNo === '224048' || user.rollNo === '224002' || user.rollNo === '224052' ? (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-blue-600" />
                  Project Author
                </span>
              ) : null}
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm flex-shrink-0 ${
                  user.role === 'student'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                    : user.role === 'teacher'
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-500'
                    : 'bg-gradient-to-tr from-amber-600 to-orange-500'
                }`}
              >
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                <p className="text-xs text-slate-500 truncate">{user.department}</p>
                {user.role === 'student' && (
                  <p className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                    Roll: {user.rollNo} • Sem {user.semester}
                  </p>
                )}
                {user.role === 'teacher' && (
                  <p className="text-[11px] font-mono text-purple-700 font-semibold mt-0.5">
                    Staff ID: {user.staffId} • {user.designation}
                  </p>
                )}
              </div>
            </div>

            {/* Detailed metadata list */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{user.phone || '+91 94481 00000'}</span>
              </div>

              {user.role === 'student' && (
                <>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Reg No: <strong className="font-mono text-slate-700">{user.regNo}</strong></span>
                    <span>Blood: <strong className="text-slate-700">{user.bloodGroup || 'O+'}</strong></span>
                  </div>
                  {user.guardianName && (
                    <div className="text-[11px] text-slate-500">
                      Guardian: <span className="font-medium text-slate-700">{user.guardianName}</span>
                    </div>
                  )}
                </>
              )}

              {user.role === 'teacher' && (
                <>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Qualification: <strong className="text-slate-700">{user.qualification}</strong>
                  </div>
                  {user.cabinNo && (
                    <div className="text-[11px] text-slate-500">
                      Cabin: <strong className="text-slate-700">{user.cabinNo}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal (Admin only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Register New Academic Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registration Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('student')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      newRole === 'student'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    BCA Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('teacher')}
                    className={`py-2 text-center rounded-lg font-semibold border ${
                      newRole === 'teacher'
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
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sanjana Kulkarni"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. name@pcjabin.edu.in"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
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
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                {newRole === 'student' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={e => setRollNo(e.target.value)}
                      placeholder="e.g. 224048"
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Staff ID</label>
                    <input
                      type="text"
                      value={staffId}
                      onChange={e => setStaffId(e.target.value)}
                      placeholder="e.g. KLE-BCA-104"
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                )}
              </div>

              {newRole === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Reg No</label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={e => setRegNo(e.target.value)}
                      placeholder="U15JC24S0048"
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={e => setSemester(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      {[1, 2, 3, 4, 5, 6].map(s => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Guardian Name</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      placeholder="Parent / Guardian"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {newRole === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      placeholder="Assistant Professor / Guide"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Qualification</label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={e => setQualification(e.target.value)}
                      placeholder="MCA / M.Tech (CSE)"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
