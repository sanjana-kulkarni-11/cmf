import React from 'react';
import { COLLEGE_INFO } from '../data/mockDatabase';
import { Award, BookOpen, GraduationCap, Users, CheckCircle, FileText, X, Sparkles } from 'lucide-react';

interface SynopsisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenERDiagram: () => void;
}

export const SynopsisModal: React.FC<SynopsisModalProps> = ({ isOpen, onClose, onOpenERDiagram }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Header with College Emblem Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wider uppercase">
              Academic Project Synopsis • 2026-27
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {COLLEGE_INFO.institution}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-wide">
              {COLLEGE_INFO.name}, <span className="text-amber-400">{COLLEGE_INFO.status}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
              ({COLLEGE_INFO.affiliation}) • {COLLEGE_INFO.location}
            </p>
            <p className="text-xs text-amber-200/80 font-mono">
              {COLLEGE_INFO.naac}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-700/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Course & Degree</span>
              <p className="text-lg font-bold text-white">{COLLEGE_INFO.department}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Project Title</span>
              <p className="text-lg font-bold text-amber-300">{COLLEGE_INFO.synopsis.title}</p>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-8 text-slate-700">
          {/* Team Members & Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Submitted By (BCA Candidates)</span>
              </div>
              <div className="space-y-3">
                {COLLEGE_INFO.synopsis.submittedBy.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
                    <div>
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500 font-mono">Reg: {member.regNo}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs font-semibold">
                      Roll: {member.rollNo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-indigo-900 font-bold">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Under The Guidance Of</span>
              </div>
              <div className="space-y-3">
                {COLLEGE_INFO.synopsis.guides.map((guide, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-100">
                    <p className="font-bold text-slate-900">{guide.name}</p>
                    <p className="text-xs text-indigo-700 font-medium">{guide.designation}</p>
                    <p className="text-xs text-slate-500 mt-1">P.C. Jabin Science College, Hubballi</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg border-b pb-2 border-slate-200">
              <FileText className="w-5 h-5 text-amber-600" />
              <h3>Problem Statement Addressed</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">❌ Fragmented College Operations</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Academic records, attendance, marks, fees and notices were handled in isolated spreadsheets or paper registers.
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">❌ Manual Attendance Tracking</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Difficult to compute mandatory 75% attendance criteria and identify shortage students in real-time.
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">❌ Fee Management Challenges</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Lack of unified digital ledger with payment breakdown, pending dues, and instant receipts.
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">❌ Communication & Learning Gap</span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Need for a single portal for circulars, assignments, syllabus downloads, and leave requests.
                </p>
              </div>
            </div>
          </div>

          {/* Key Objectives */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg border-b pb-2 border-slate-200">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h3>Project Objectives & Modules Implemented</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Role-Based Access:</strong> Separate portals for Administrator, Teachers, and Students.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Student & Faculty Records:</strong> Full directory with semester, roll numbers and contact info.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Automated Attendance:</strong> Subject-wise sessions, instant % calculation and shortage alerts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Marks & Grade Engine:</strong> IA1, IA2, SEE integration with SGPA and downloadable grade card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Fee Ledger & Receipts:</strong> Online payment simulator with official downloadable receipts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                <span><strong>Assignments & Materials:</strong> Submission portal with teacher grading, syllabus & notes hub.</span>
              </li>
            </ul>
          </div>

          {/* Technology Stack & Architecture Button */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-300 text-sm">Proposed Architecture: Full MERN Stack</span>
              </div>
              <p className="text-xs text-slate-300">
                MongoDB Document Collections • Express.js REST APIs • React.js Modern Components • Node.js Runtime
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenERDiagram();
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>View ER Diagram & Schema</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>K.L.E. Society's P.C. Jabin Science College, Hubballi</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Close Synopsis
          </button>
        </div>
      </div>
    </div>
  );
};
