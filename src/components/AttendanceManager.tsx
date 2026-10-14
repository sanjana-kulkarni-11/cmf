import React, { useState } from 'react';
import { User, AttendanceRecord, Subject } from '../types';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  Filter,
  Users,
  ShieldCheck,
  Check,
  Save,
  BookOpen
} from 'lucide-react';

interface AttendanceManagerProps {
  currentUser: User;
  allUsers: User[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  currentUser,
  allUsers,
  subjects,
  attendance,
  onAddAttendance
}) => {
  const students = allUsers.filter(u => u.role === 'student');

  // Take Attendance State (Teacher / Admin)
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      map[s.id] = 'present';
    });
    return map;
  });
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);

  // Subject chosen
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Bulk actions
  const markAll = (status: 'present' | 'absent') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setStudentStatusMap(updated);
  };

  const handleSaveSession = () => {
    const newSession: AttendanceRecord = {
      id: `att_${Date.now()}`,
      date: sessionDate,
      subjectId: activeSubject.id,
      subjectCode: activeSubject.code,
      subjectName: activeSubject.name,
      semester: 5,
      section: 'A',
      teacherId: currentUser.id,
      records: students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        rollNo: s.rollNo || '224000',
        status: studentStatusMap[s.id] || 'present'
      }))
    };

    onAddAttendance(newSession);
    setIsSuccessAlert(true);
    setTimeout(() => setIsSuccessAlert(false), 3500);
  };

  // Student-wise overall attendance statistics
  const studentStats = students.map(stu => {
    let conducted = 0;
    let attended = 0;
    attendance.forEach(session => {
      const rec = session.records.find(r => r.studentId === stu.id);
      if (rec) {
        conducted++;
        if (rec.status === 'present' || rec.status === 'late') {
          attended++;
        }
      }
    });
    const percentage = conducted > 0 ? Math.round((attended / conducted) * 100) : 100;
    return {
      student: stu,
      conducted,
      attended,
      percentage,
      isShortage: percentage < 75
    };
  });

  const lowAttendanceStudents = studentStats.filter(s => s.isShortage);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Autonomous Attendance Automation Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Karnatak University Autonomous Criteria: Mandatory 75% for SEE Examination
          </p>
        </div>

        {lowAttendanceStudents.length > 0 && (
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{lowAttendanceStudents.length} Student(s) with Attendance Shortage (&lt;75%)</span>
          </div>
        )}
      </div>

      {isSuccessAlert && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Attendance session successfully saved and committed to local database. Aggregate percentages updated!</span>
        </div>
      )}

      {/* Teacher / Admin Take Attendance Console */}
      {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Mark Daily Attendance Session</span>
              </h3>
              <p className="text-xs text-slate-500">Record lecture attendance for BCA Semester V</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markAll('present')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <button
                type="button"
                onClick={() => markAll('absent')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Mark All Absent</span>
              </button>
            </div>
          </div>

          {/* Session parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subject & Course Unit</label>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-medium"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name} ({s.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Semester & Section</label>
              <input
                type="text"
                disabled
                value="BCA V Semester - Section A"
                className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-600 rounded-lg font-semibold"
              />
            </div>
          </div>

          {/* Students list toggle */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 grid grid-cols-12 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Roll No</span>
              <span className="col-span-5">Student Name</span>
              <span className="col-span-2">Reg No</span>
              <span className="col-span-3 text-right">Attendance Status</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {students.map(stu => {
                const currentStatus = studentStatusMap[stu.id] || 'present';
                return (
                  <div key={stu.id} className="px-4 py-3 grid grid-cols-12 items-center text-xs hover:bg-slate-50/80">
                    <span className="col-span-2 font-mono font-bold text-blue-800">{stu.rollNo}</span>
                    <span className="col-span-5 font-semibold text-slate-900">{stu.name}</span>
                    <span className="col-span-2 text-slate-500 font-mono text-[11px]">{stu.regNo}</span>
                    <div className="col-span-3 flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStudentStatusMap({ ...studentStatusMap, [stu.id]: 'present' })}
                        className={`px-2.5 py-1 rounded font-bold transition-all ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudentStatusMap({ ...studentStatusMap, [stu.id]: 'late' })}
                        className={`px-2.5 py-1 rounded font-bold transition-all ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudentStatusMap({ ...studentStatusMap, [stu.id]: 'absent' })}
                        className={`px-2.5 py-1 rounded font-bold transition-all ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        A
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveSession}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Attendance Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Aggregate Student Attendance Roster & Eligibility Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Cumulative Student Attendance & Autonomous Exam Eligibility
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across all recorded lecture hours. Threshold: 75%
            </p>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-lg font-semibold">
            Total Sessions: {attendance.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Total Sessions</th>
                <th className="py-3 px-4">Attended</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Autonomous Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentStats.map((stat, i) => (
                <tr key={stat.student.id} className={stat.isShortage ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'}>
                  <td className="py-3 px-4 font-mono font-bold text-blue-900">{stat.student.rollNo}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {stat.student.name}
                    {currentUser.id === stat.student.id && (
                      <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        You
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">{stat.conducted}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{stat.attended}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold font-mono ${stat.percentage >= 75 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {stat.percentage}%
                      </span>
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${stat.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {stat.percentage >= 75 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Eligible for SEE Exam
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-semibold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Shortage Warning (&lt;75%)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
