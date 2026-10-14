import React, { useState } from 'react';
import { User, MarksRecord, Subject } from '../types';
import { COLLEGE_INFO } from '../data/mockDatabase';
import {
  GraduationCap,
  Award,
  Edit3,
  Printer,
  Save,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  X,
  Sparkles
} from 'lucide-react';

interface MarksManagerProps {
  currentUser: User;
  allUsers: User[];
  subjects: Subject[];
  marks: MarksRecord[];
  onUpdateMarks: (record: MarksRecord) => void;
}

export const MarksManager: React.FC<MarksManagerProps> = ({
  currentUser,
  allUsers,
  subjects,
  marks,
  onUpdateMarks
}) => {
  const students = allUsers.filter(u => u.role === 'student');

  // Filter selection
  const [selectedStudentId, setSelectedStudentId] = useState(
    currentUser.role === 'student' ? currentUser.id : students[0]?.id || ''
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MarksRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Active student
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeStudentMarks = marks.filter(m => m.studentId === activeStudent?.id);

  // Helper to compute grade from total
  const computeGrade = (total: number) => {
    if (total >= 90) return { grade: 'O', gradePoint: 10, status: 'Pass' as const };
    if (total >= 80) return { grade: 'A+', gradePoint: 9, status: 'Pass' as const };
    if (total >= 70) return { grade: 'A', gradePoint: 8, status: 'Pass' as const };
    if (total >= 60) return { grade: 'B+', gradePoint: 7, status: 'Pass' as const };
    if (total >= 50) return { grade: 'B', gradePoint: 6, status: 'Pass' as const };
    if (total >= 40) return { grade: 'C', gradePoint: 5, status: 'Pass' as const };
    return { grade: 'F', gradePoint: 0, status: 'Fail' as const };
  };

  // Form state for editing
  const [ia1Input, setIa1Input] = useState(18);
  const [ia2Input, setIa2Input] = useState(19);
  const [assignmentInput, setAssignmentInput] = useState(10);
  const [seeInput, setSeeInput] = useState(45);

  const openEditor = (record: MarksRecord) => {
    setEditingRecord(record);
    setIa1Input(record.ia1);
    setIa2Input(record.ia2);
    setAssignmentInput(record.assignment);
    setSeeInput(record.see);
    setIsEditModalOpen(true);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const total = ia1Input + ia2Input + assignmentInput + seeInput;
    const { grade, gradePoint, status } = computeGrade(total);

    const updated: MarksRecord = {
      ...editingRecord,
      ia1: ia1Input,
      ia2: ia2Input,
      assignment: assignmentInput,
      see: seeInput,
      total,
      grade,
      gradePoint,
      status
    };

    onUpdateMarks(updated);
    setIsEditModalOpen(false);
  };

  // Compute SGPA for current student
  const totalCredits = activeStudentMarks.length * 4;
  const totalGradePoints = activeStudentMarks.reduce((acc, m) => acc + (m.gradePoint * 4), 0);
  const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '9.40';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Autonomous Examination & Marks Evaluation System</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Karnatak University Autonomous CBCS Scheme • Continuous Internal Evaluation (CIE) + SEE
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role !== 'student' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Select Student:</span>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="text-xs font-semibold p-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Official Grade Card</span>
          </button>
        </div>
      </div>

      {/* Student Summary Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
            Statement of Academic Performance
          </span>
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <span>{activeStudent?.name}</span>
            <span className="text-xs font-mono bg-blue-700/60 text-blue-200 px-2 py-0.5 rounded font-normal">
              Roll: {activeStudent?.rollNo}
            </span>
          </h3>
          <p className="text-xs text-blue-200 font-mono">
            University Reg No: {activeStudent?.regNo} • BCA Semester V (Autonomous)
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-blue-300 block">Semester SGPA</span>
            <span className="text-3xl font-black text-amber-300">{sgpa}</span>
            <span className="text-xs text-emerald-400 block font-semibold">Grade 'O' (Outstanding)</span>
          </div>
          <div className="h-12 w-[1px] bg-blue-700" />
          <div className="text-right">
            <span className="text-xs text-blue-300 block">Total Subjects</span>
            <span className="text-2xl font-bold">{activeStudentMarks.length} Courses</span>
            <span className="text-xs text-blue-200 block">All Cleared (100% Pass)</span>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Course-wise Marks Breakdown (Semester V)</h3>
            <p className="text-xs text-slate-500">
              IA-1 (20) • IA-2 (20) • Assignment/Seminar (10) • SEE Examination (50) • Total (100)
            </p>
          </div>
          {currentUser.role !== 'student' && (
            <span className="text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-lg font-semibold">
              Faculty / Admin Grading Enabled
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Title</th>
                <th className="py-3 px-3 text-center">IA-1 (20)</th>
                <th className="py-3 px-3 text-center">IA-2 (20)</th>
                <th className="py-3 px-3 text-center">Assignment (10)</th>
                <th className="py-3 px-3 text-center">SEE (50)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">Letter Grade</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-4 text-center">Result</th>
                {currentUser.role !== 'student' && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeStudentMarks.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-blue-900">{item.subjectCode}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.subjectName}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.ia1}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.ia2}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.assignment}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-indigo-700">{item.see}</td>
                  <td className="py-3 px-3 text-center font-mono font-extrabold text-slate-900">{item.total}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-100 text-emerald-800 font-mono">
                      {item.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{item.gradePoint}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold text-[10px]">
                      {item.status}
                    </span>
                  </td>
                  {currentUser.role !== 'student' && (
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEditor(item)}
                        className="px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Marks Modal */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Update Academic Marks</h3>
                <p className="text-xs text-slate-500">{editingRecord.subjectCode} - {editingRecord.subjectName}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">IA-1 Marks (Max 20)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={ia1Input}
                    onChange={e => setIa1Input(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">IA-2 Marks (Max 20)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={ia2Input}
                    onChange={e => setIa2Input(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assignment (Max 10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={assignmentInput}
                    onChange={e => setAssignmentInput(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SEE Exam (Max 50)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={seeInput}
                    onChange={e => setSeeInput(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span>Calculated Total:</span>
                <span className="font-extrabold text-blue-900 font-mono text-sm">
                  {ia1Input + ia2Input + assignmentInput + seeInput} / 100
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Grade Card Printable Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 border-2 border-slate-300 my-8">
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Header */}
            <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-700">
                {COLLEGE_INFO.institution}
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {COLLEGE_INFO.name}
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                ({COLLEGE_INFO.status}) • {COLLEGE_INFO.affiliation}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {COLLEGE_INFO.location} • {COLLEGE_INFO.naac}
              </p>
              <div className="pt-3">
                <span className="inline-block px-4 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded">
                  Official Grade Sheet / Statement of Marks
                </span>
              </div>
            </div>

            {/* Student Particulars */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <p>Candidate Name: <strong className="text-slate-900 font-bold">{activeStudent?.name}</strong></p>
                <p>Roll Number: <strong className="font-mono text-slate-900">{activeStudent?.rollNo}</strong></p>
                <p>Degree Program: <strong>Bachelor of Computer Application (BCA)</strong></p>
              </div>
              <div className="space-y-1 text-right">
                <p>Registration No: <strong className="font-mono text-slate-900">{activeStudent?.regNo}</strong></p>
                <p>Academic Semester: <strong>Semester V (2026-27)</strong></p>
                <p>Examination Month: <strong>November - December 2026</strong></p>
              </div>
            </div>

            {/* Marks List */}
            <div className="py-4">
              <table className="w-full text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Code</th>
                    <th className="p-2 border-r border-slate-300 text-left">Course Title</th>
                    <th className="p-2 border-r border-slate-300 text-center">CIE (50)</th>
                    <th className="p-2 border-r border-slate-300 text-center">SEE (50)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Total (100)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Grade</th>
                    <th className="p-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeStudentMarks.map(m => (
                    <tr key={m.id}>
                      <td className="p-2 font-mono font-bold text-center border-r border-slate-300">{m.subjectCode}</td>
                      <td className="p-2 font-medium border-r border-slate-300">{m.subjectName}</td>
                      <td className="p-2 text-center font-mono border-r border-slate-300">{m.ia1 + m.ia2 + m.assignment}</td>
                      <td className="p-2 text-center font-mono border-r border-slate-300">{m.see}</td>
                      <td className="p-2 text-center font-mono font-bold border-r border-slate-300">{m.total}</td>
                      <td className="p-2 text-center font-bold border-r border-slate-300">{m.grade}</td>
                      <td className="p-2 text-center font-semibold text-emerald-700">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SGPA & Signatures */}
            <div className="pt-4 border-t-2 border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-sm font-black text-slate-900">Semester SGPA: {sgpa} / 10.0</p>
                <p className="text-emerald-700 font-bold text-xs mt-0.5">Classification: First Class with Distinction</p>
              </div>

              <div className="flex gap-8 text-center text-[11px] text-slate-600">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                  <span>Head of Department (BCA)</span>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
                  <span>Controller of Examinations</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
