import React from 'react';
import { User, AttendanceRecord, MarksRecord, FeeItem, Assignment, Submission, Notice, CollegeEvent } from '../types';
import {
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  CreditCard,
  FileText,
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  BookOpen,
  Sparkles,
  Bell
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  allUsers: User[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  fees: FeeItem[];
  assignments: Assignment[];
  submissions: Submission[];
  notices: Notice[];
  events: CollegeEvent[];
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  allUsers,
  attendance,
  marks,
  fees,
  assignments,
  submissions,
  notices,
  events,
  onNavigateTab
}) => {
  const students = allUsers.filter(u => u.role === 'student');
  const teachers = allUsers.filter(u => u.role === 'teacher');

  // Student specific stats
  const studentMarks = marks.filter(m => m.studentId === currentUser.id);
  const studentFee = fees.find(f => f.studentId === currentUser.id);
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // Student attendance calculation
  let totalStudentSessions = 0;
  let attendedStudentSessions = 0;
  attendance.forEach(session => {
    const rec = session.records.find(r => r.studentId === currentUser.id);
    if (rec) {
      totalStudentSessions++;
      if (rec.status === 'present' || rec.status === 'late') {
        attendedStudentSessions++;
      }
    }
  });
  const studentAttendancePct = totalStudentSessions > 0
    ? Math.round((attendedStudentSessions / totalStudentSessions) * 100)
    : 92;

  // Student SGPA calculation
  const totalGradePoints = studentMarks.reduce((sum, m) => sum + (m.gradePoint * 4), 0);
  const totalCredits = studentMarks.length * 4;
  const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '9.65';

  // Admin stats
  const totalFeeCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalFeePending = fees.reduce((sum, f) => sum + f.pendingAmount, 0);

  // Teacher stats
  const teacherSubjects = ['BCA501 - Web Tech & MERN', 'BCA506L - MERN Lab', 'BCA503 - Cloud DevOps'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>K.L.E. Society's P.C. Jabin Science College Autonomous • Hubballi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-amber-300">{currentUser.name}</span>
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl">
              {currentUser.role === 'student' && (
                <>
                  Logged in as <strong className="text-white">BCA Semester V</strong> Candidate (Roll No: <span className="font-mono text-amber-200">{currentUser.rollNo}</span> • Reg No: <span className="font-mono text-amber-200">{currentUser.regNo}</span>). Track your attendance, marks, fees and assignments.
                </>
              )}
              {currentUser.role === 'teacher' && (
                <>
                  Faculty Portal: Department of Computer Applications. Staff ID: <span className="font-mono text-amber-200">{currentUser.staffId}</span>. Manage attendance sessions, evaluate assignments, and monitor student academic milestones.
                </>
              )}
              {currentUser.role === 'admin' && (
                <>
                  Central Administrative Dashboard: Monitor academic workflows, fee collections, faculty allocations, and Autonomous Examination schedules.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab(currentUser.role === 'student' ? 'attendance' : 'directory')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg"
            >
              <span>{currentUser.role === 'student' ? 'View Attendance Register' : 'Manage Academic Records'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards based on Role */}
      {currentUser.role === 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Attendance KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
              <div className={`p-2 rounded-xl ${studentAttendancePct >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{studentAttendancePct}%</span>
              <span className={`text-xs font-semibold ${studentAttendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {studentAttendancePct >= 75 ? 'Eligible for SEE' : 'Shortage Alert (<75%)'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${studentAttendancePct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${studentAttendancePct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {attendedStudentSessions} of {totalStudentSessions} recorded sessions attended
            </p>
          </div>

          {/* SGPA KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semester SGPA</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{sgpa}</span>
              <span className="text-xs font-semibold text-blue-600">/ 10.0 (Grade O)</span>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1 font-medium text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Top 5% in BCA V Semester</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Autonomous evaluation scale</p>
          </div>

          {/* Fee Status KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Fee</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{studentFee ? studentFee.paidAmount.toLocaleString() : '42,500'}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                studentFee?.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {studentFee ? studentFee.status : 'Paid'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Pending: <strong className="text-slate-800">₹{studentFee ? studentFee.pendingAmount.toLocaleString() : '0'}</strong>
            </p>
            <button
              onClick={() => onNavigateTab('fees')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
            >
              <span>View Fee Ledger & Receipt</span> &rarr;
            </button>
          </div>

          {/* Assignments KPI */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignments</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{studentSubmissions.length}</span>
              <span className="text-xs text-slate-500 font-medium">/ {assignments.length} Submissions</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>All submitted assignments graded!</span>
            </p>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
            >
              <span>Open Assignment Portal</span> &rarr;
            </button>
          </div>
        </div>
      )}

      {currentUser.role === 'teacher' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allocated Subjects</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">3 Courses</span>
            <p className="text-xs text-slate-600 mt-2">BCA501 (MERN), BCA506L (Lab), BCA503</p>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Autonomous Curriculum 2026-27</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Under Care</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{students.length} Students</span>
            <p className="text-xs text-slate-600 mt-2">BCA V Semester - Section A</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Average Attendance: 91.4%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Evaluation</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">
              {assignments.length} Tasks
            </span>
            <p className="text-xs text-slate-600 mt-2">MERN REST API & MongoDB</p>
            <button
              onClick={() => onNavigateTab('assignments')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
            >
              <span>Grade Submissions</span> &rarr;
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortage Watchlist</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-rose-600">1 Student</span>
            <p className="text-xs text-slate-600 mt-2">Rahul Desai (Roll: 224035) at 60%</p>
            <p className="text-[11px] text-rose-500 font-medium mt-1">Parent intimation SMS generated</p>
          </div>
        </div>
      )}

      {currentUser.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{students.length} Active</span>
            <p className="text-xs text-slate-500 mt-2">BCA Program (Autonomous)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Guides</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">{teachers.length} Professors</span>
            <p className="text-xs text-slate-500 mt-2">Prof. Sampada S & Prof. Akash</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Collections</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-emerald-700">₹{totalFeeCollected.toLocaleString()}</span>
            <p className="text-xs text-slate-500 mt-2">Pending Dues: ₹{totalFeePending.toLocaleString()}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Overall</span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <span className="text-3xl font-extrabold text-slate-900">92.6%</span>
            <p className="text-xs text-slate-500 mt-2">Autonomous Compliance Satisfied</p>
          </div>
        </div>
      )}

      {/* Main Grid: Schedule & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Classes & Academic Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Schedule Today */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Today's Class Schedule (Monday)</h3>
              </div>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Full Week Timetable &rarr;
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-blue-600 text-white font-mono text-xs font-bold rounded">
                    09:00 - 10:00
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Web Technology & MERN Stack (BCA501)</h4>
                    <p className="text-xs text-slate-600">Prof. Sampada S • Room 204</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded mt-2 sm:mt-0 self-start sm:self-auto">
                  Theory Session
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-slate-700 text-white font-mono text-xs font-bold rounded">
                    10:00 - 11:00
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Database Management & MongoDB (BCA502)</h4>
                    <p className="text-xs text-slate-600">Prof. Akash • Room 204</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded mt-2 sm:mt-0 self-start sm:self-auto">
                  Theory Session
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-amber-600 text-white font-mono text-xs font-bold rounded">
                    01:00 - 04:00
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Web Development Lab (MERN) - BCA506L</h4>
                    <p className="text-xs text-slate-600">Prof. Sampada S • Computer Lab 3</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mt-2 sm:mt-0 self-start sm:self-auto">
                  Practical Lab Session
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-sm uppercase tracking-wider text-amber-300 mb-3">
              Quick Administrative & Academic Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left border border-white/10 transition-colors"
              >
                <Calendar className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-xs font-bold block">Attendance</span>
                <span className="text-[10px] text-slate-300">Daily entry</span>
              </button>
              <button
                onClick={() => onNavigateTab('marks')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left border border-white/10 transition-colors"
              >
                <GraduationCap className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-xs font-bold block">Marks / SGPA</span>
                <span className="text-[10px] text-slate-300">IA & SEE cards</span>
              </button>
              <button
                onClick={() => onNavigateTab('fees')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left border border-white/10 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-xs font-bold block">Fee Portal</span>
                <span className="text-[10px] text-slate-300">Receipts & dues</span>
              </button>
              <button
                onClick={() => onNavigateTab('materials')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left border border-white/10 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-purple-400 mb-1" />
                <span className="text-xs font-bold block">Syllabus & Notes</span>
                <span className="text-[10px] text-slate-300">Autonomous repo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Urgent Notices & College Events */}
        <div className="space-y-6">
          {/* Urgent Notices */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">College Circulars</h3>
              </div>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                All Notices &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map(n => (
                <div key={n.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    {n.isUrgent && (
                      <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold uppercase animate-pulse">
                        Urgent
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {n.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">
                      {n.publishedDate}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming College Events */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Upcoming Events</h3>
              </div>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Calendar &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {events.map(evt => (
                <div key={evt.id} className="p-3 border-l-4 border-indigo-500 bg-indigo-50/40 rounded-r-xl">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                    {evt.date} • {evt.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-0.5">{evt.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1">{evt.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
