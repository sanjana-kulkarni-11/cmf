import React, { useState, useEffect } from 'react';
import { User, Subject, AttendanceRecord, MarksRecord, FeeItem, Assignment, Submission, StudyMaterial, Notice, TimetableSlot, LeaveRequest, CollegeEvent } from './types';
import { ApiService } from './utils/api';
import { StorageService } from './utils/storage';
import { Header } from './components/Header';
import { ERDiagramModal } from './components/ERDiagramModal';
import { Dashboard } from './components/Dashboard';
import { StudentFacultyDirectory } from './components/StudentFacultyDirectory';
import { AttendanceManager } from './components/AttendanceManager';
import { MarksManager } from './components/MarksManager';
import { FeeManager } from './components/FeeManager';
import { AssignmentManager } from './components/AssignmentManager';
import { StudyMaterialHub } from './components/StudyMaterialHub';
import { NoticeBoard } from './components/NoticeBoard';
import { TimetableAndEvents } from './components/TimetableAndEvents';
import { LeaveManager } from './components/LeaveManager';
import { AuthPage } from './components/AuthPage';
import { COLLEGE_INFO } from './data/mockDatabase';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  FileCheck2,
  BookOpen,
  Bell,
  Clock,
  UserCheck
} from 'lucide-react';

export default function App() {
  // App state initialized from storage and synced with MongoDB backend
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => StorageService.getUsers());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [marks, setMarks] = useState<MarksRecord[]>(() => StorageService.getMarks());
  const [fees, setFees] = useState<FeeItem[]>(() => StorageService.getFees());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [submissions, setSubmissions] = useState<Submission[]>(() => StorageService.getSubmissions());
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => StorageService.getMaterials());
  const [notices, setNotices] = useState<Notice[]>(() => StorageService.getNotices());
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => StorageService.getTimetable());
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => StorageService.getLeaves());
  const [events, setEvents] = useState<CollegeEvent[]>(() => StorageService.getEvents());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('pc_jabin_auth_session');
    return saved !== 'false'; // Default to true or check storage
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // ER Diagram Modal
  const [isERDiagramOpen, setIsERDiagramOpen] = useState(false);

  // Sync state from MongoDB backend REST APIs on mount
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        const [
          usersData,
          subjectsData,
          attendanceData,
          marksData,
          feesData,
          assignmentsData,
          submissionsData,
          materialsData,
          noticesData,
          timetableData,
          leavesData,
          eventsData
        ] = await Promise.all([
          ApiService.getUsers(),
          ApiService.getSubjects(),
          ApiService.getAttendance(),
          ApiService.getMarks(),
          ApiService.getFees(),
          ApiService.getAssignments(),
          ApiService.getSubmissions(),
          ApiService.getMaterials(),
          ApiService.getNotices(),
          ApiService.getTimetable(),
          ApiService.getLeaves(),
          ApiService.getEvents()
        ]);

        if (isMounted) {
          if (usersData?.length) setAllUsers(usersData);
          if (subjectsData?.length) setSubjects(subjectsData);
          if (attendanceData?.length) setAttendance(attendanceData);
          if (marksData?.length) setMarks(marksData);
          if (feesData?.length) setFees(feesData);
          if (assignmentsData?.length) setAssignments(assignmentsData);
          if (submissionsData?.length) setSubmissions(submissionsData);
          if (materialsData?.length) setMaterials(materialsData);
          if (noticesData?.length) setNotices(noticesData);
          if (timetableData?.length) setTimetable(timetableData);
          if (leavesData?.length) setLeaves(leavesData);
          if (eventsData?.length) setEvents(eventsData);
        }
      } catch (err) {
        console.warn('Backend MongoDB sync in-progress, local store active:', err);
      }
    }

    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state helpers with MongoDB backend
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('pc_jabin_auth_session', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('pc_jabin_auth_session', 'false');
  };

  const handleResetData = async () => {
    await ApiService.resetDatabase();
    window.location.reload();
  };

  const handleAddUser = async (user: User) => {
    const saved = await ApiService.addUser(user);
    setAllUsers(prev => [...prev, saved]);
  };

  const handleAddAttendance = async (record: AttendanceRecord) => {
    const saved = await ApiService.addAttendance(record);
    setAttendance(prev => [saved, ...prev]);
  };

  const handleUpdateMarks = async (record: MarksRecord) => {
    const saved = await ApiService.updateMarks(record);
    setMarks(prev => {
      const idx = prev.findIndex(m => m.id === saved.id || (m.studentId === saved.studentId && m.subjectId === saved.subjectId));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
  };

  const handlePayFee = async (studentId: string, amount: number, mode: 'Online' | 'UPI' | 'NetBanking' | 'Challan', ref: string) => {
    await ApiService.payFee(studentId, amount, mode, ref);
    const updatedFees = await ApiService.getFees();
    setFees(updatedFees);
  };

  const handleAddAssignment = async (asg: Assignment) => {
    const saved = await ApiService.addAssignment(asg);
    setAssignments(prev => [saved, ...prev]);
  };

  const handleSubmitWork = async (sub: Submission) => {
    const saved = await ApiService.submitWork(sub);
    setSubmissions(prev => {
      const idx = prev.findIndex(s => s.id === saved.id || (s.assignmentId === saved.assignmentId && s.studentId === saved.studentId));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleAddMaterial = async (mat: StudyMaterial) => {
    const saved = await ApiService.addMaterial(mat);
    setMaterials(prev => [saved, ...prev]);
  };

  const handleAddNotice = async (notice: Notice) => {
    const saved = await ApiService.addNotice(notice);
    setNotices(prev => [saved, ...prev]);
  };

  const handleAddLeave = async (leave: LeaveRequest) => {
    const saved = await ApiService.addLeave(leave);
    setLeaves(prev => [saved, ...prev]);
  };

  const handleUpdateLeaveStatus = async (leaveId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    await ApiService.updateLeaveStatus(leaveId, status, comment);
    setLeaves(prev =>
      prev.map(l => (l.id === leaveId ? { ...l, status, comment: comment || l.comment } : l))
    );
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'marks', label: 'Marks & SGPA', icon: GraduationCap },
    { id: 'fees', label: 'Fee Management', icon: CreditCard },
    { id: 'assignments', label: 'Assignments', icon: FileCheck2 },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'timetable', label: 'Timetable & Events', icon: Clock },
    { id: 'leaves', label: 'Leave Portal', icon: UserCheck }
  ];

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} availableUsers={allUsers} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onOpenERDiagram={() => setIsERDiagramOpen(true)}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* Navigation Tab Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-[77px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            allUsers={allUsers}
            attendance={attendance}
            marks={marks}
            fees={fees}
            assignments={assignments}
            submissions={submissions}
            notices={notices}
            events={events}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'directory' && (
          <StudentFacultyDirectory
            currentUser={currentUser}
            users={allUsers}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceManager
            currentUser={currentUser}
            allUsers={allUsers}
            subjects={subjects}
            attendance={attendance}
            onAddAttendance={handleAddAttendance}
          />
        )}

        {activeTab === 'marks' && (
          <MarksManager
            currentUser={currentUser}
            allUsers={allUsers}
            subjects={subjects}
            marks={marks}
            onUpdateMarks={handleUpdateMarks}
          />
        )}

        {activeTab === 'fees' && (
          <FeeManager
            currentUser={currentUser}
            allUsers={allUsers}
            fees={fees}
            onPayFee={handlePayFee}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentManager
            currentUser={currentUser}
            allUsers={allUsers}
            subjects={subjects}
            assignments={assignments}
            submissions={submissions}
            onAddAssignment={handleAddAssignment}
            onSubmitWork={handleSubmitWork}
          />
        )}

        {activeTab === 'materials' && (
          <StudyMaterialHub
            currentUser={currentUser}
            materials={materials}
            onAddMaterial={handleAddMaterial}
          />
        )}

        {activeTab === 'notices' && (
          <NoticeBoard
            currentUser={currentUser}
            notices={notices}
            onAddNotice={handleAddNotice}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableAndEvents
            currentUser={currentUser}
            timetable={timetable}
            events={events}
          />
        )}

        {activeTab === 'leaves' && (
          <LeaveManager
            currentUser={currentUser}
            leaves={leaves}
            onAddLeave={handleAddLeave}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
          />
        )}
      </main>

      {/* College Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-white text-sm">
              {COLLEGE_INFO.institution} {COLLEGE_INFO.name}, {COLLEGE_INFO.status}
            </p>
            <p className="text-slate-400">
              {COLLEGE_INFO.affiliation} • {COLLEGE_INFO.location}
            </p>
            <p className="text-amber-400 font-mono text-[11px]">
              {COLLEGE_INFO.naac}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-right text-xs text-slate-300">
            <div>
              <span className="font-semibold block text-white">BCA Major Project (2026-27)</span>
              <span>Submitted by: <strong>Sanjana Kulkarni (224048)</strong>, <strong>Aishwarya Angadi (224002)</strong>, <strong>Shivchetan (224052)</strong></span>
              <span className="block text-slate-400">Under Guidance of: <strong>Prof. Sampada S</strong> & <strong>Prof. Akash</strong></span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm whitespace-nowrap"
            >
              Switch Account / Login
            </button>
          </div>
        </div>
      </footer>

      {/* MERN Database ER Schema Modal */}
      <ERDiagramModal
        isOpen={isERDiagramOpen}
        onClose={() => setIsERDiagramOpen(false)}
      />
    </div>
  );
}
