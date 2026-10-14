import React, { useState } from 'react';
import { Database, X, ArrowRight, Layers, Table, Network, Check, Code } from 'lucide-react';

interface ERDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERDiagramModal: React.FC<ERDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'er' | 'schemas' | 'dataflow'>('er');

  if (!isOpen) return null;

  const collections = [
    {
      name: "users",
      desc: "Base authentication, role (admin/teacher/student), profile info",
      fields: ["_id (ObjectId)", "email (String, unique)", "password (Hashed)", "role (Enum)", "name (String)", "phone (String)", "department (String)"],
      relations: ["1:1 with students (for student role)", "1:1 with teachers (for faculty role)"]
    },
    {
      name: "students",
      desc: "Academic profile, roll no, university registration no, semester",
      fields: ["_id (ObjectId)", "userId (Ref: users)", "rollNo (String, indexed)", "regNo (String, unique)", "semester (Number)", "section (String)", "guardianName (String)"],
      relations: ["1:N with attendance.records", "1:N with marks", "1:N with fees", "1:N with submissions"]
    },
    {
      name: "teachers",
      desc: "Faculty profile, staff ID, qualifications, cabin",
      fields: ["_id (ObjectId)", "userId (Ref: users)", "staffId (String, unique)", "designation (String)", "qualification (String)", "specialization (Array)"],
      relations: ["1:N with subjects", "1:N with assignments", "1:N with study_materials"]
    },
    {
      name: "subjects",
      desc: "Curriculum course units, credits, faculty allocation",
      fields: ["_id (ObjectId)", "code (String, e.g. BCA501)", "name (String)", "semester (Number)", "credits (Number)", "facultyId (Ref: teachers)", "type (Enum)"],
      relations: ["1:N with attendance", "1:N with marks", "1:N with assignments"]
    },
    {
      name: "attendance",
      desc: "Daily session records with batch status per student",
      fields: ["_id (ObjectId)", "date (Date)", "subjectId (Ref: subjects)", "semester (Number)", "teacherId (Ref: teachers)", "records [{ studentId, status }]"],
      relations: ["Belongs to subjects & teachers", "References multiple students"]
    },
    {
      name: "marks",
      desc: "IA-1, IA-2, Assignment, and SEE semester examination performance",
      fields: ["_id (ObjectId)", "studentId (Ref: students)", "subjectId (Ref: subjects)", "semester (Number)", "ia1 (Number)", "ia2 (Number)", "see (Number)", "grade (String)"],
      relations: ["Belongs to students & subjects"]
    },
    {
      name: "fees",
      desc: "Student fee ledger, component breakdown, and transaction history",
      fields: ["_id (ObjectId)", "studentId (Ref: students)", "semester (Number)", "totalFee (Number)", "paidAmount (Number)", "pendingAmount (Number)", "transactions []"],
      relations: ["Belongs to student"]
    },
    {
      name: "assignments & submissions",
      desc: "Coursework tasks posted by faculty & student code/file submissions",
      fields: ["assignmentId (ObjectId)", "studentId (Ref: students)", "submissionContent (Text)", "marksObtained (Number)", "feedback (String)"],
      relations: ["Parent assignment -> child submissions"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                MERN Database Architecture & ER Design
              </h2>
              <p className="text-xs text-slate-400">
                K.L.E. Society's P.C. Jabin Science College Autonomous • BCA Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('er')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'er'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Interactive ER Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'schemas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>MongoDB Collections ({collections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dataflow')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'dataflow'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>MERN System Data Flow</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'er' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>
                  <strong>Entity-Relationship Architecture:</strong> Relational abstractions implemented using MongoDB referenced documents and embedded subdocuments.
                </span>
                <span className="font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded">BCA Semester V</span>
              </div>

              {/* Visual Nodes and Edges representation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User & Auth Node */}
                <div className="border-2 border-blue-500 bg-blue-50/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-2">
                    <span className="font-bold text-blue-900 text-sm">USER ENTITY</span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono">1:1 Root</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>🔑 id (PK)</li>
                    <li>📧 email (unique)</li>
                    <li>🔒 password_hash</li>
                    <li>🎭 role (admin|teacher|student)</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-blue-200 text-[11px] text-blue-700 font-medium flex items-center justify-between">
                    <span>Role Specialization</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Student Node */}
                <div className="border-2 border-emerald-500 bg-emerald-50/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-2">
                    <span className="font-bold text-emerald-900 text-sm">STUDENT ENTITY</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">Core</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>🔑 id / rollNo (224048)</li>
                    <li>🏷️ regNo (U15JC...)</li>
                    <li>🎓 semester (1-6)</li>
                    <li>👤 userId (FK)</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] text-emerald-700 font-medium">
                    Connected to Attendance, Marks, Fees, Submissions
                  </div>
                </div>

                {/* Faculty Node */}
                <div className="border-2 border-purple-500 bg-purple-50/50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2 mb-2">
                    <span className="font-bold text-purple-900 text-sm">TEACHER / FACULTY</span>
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-mono">Guide</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>🔑 staffId (KLE-BCA-104)</li>
                    <li>👨‍🏫 userId (FK)</li>
                    <li>📜 designation</li>
                    <li>🏛️ department</li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-purple-200 text-[11px] text-purple-700 font-medium">
                    Teaches Subjects, Creates Assignments, Marks Attendance
                  </div>
                </div>

                {/* Subject Node */}
                <div className="border border-amber-400 bg-amber-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2">
                    <span className="font-bold text-amber-900 text-sm">SUBJECTS</span>
                    <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded font-mono">1:N</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>🔑 code (BCA501)</li>
                    <li>📖 name</li>
                    <li>⭐ credits (4)</li>
                    <li>👨‍🏫 facultyId (FK)</li>
                  </ul>
                </div>

                {/* Attendance Node */}
                <div className="border border-sky-400 bg-sky-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-2 mb-2">
                    <span className="font-bold text-sky-900 text-sm">ATTENDANCE</span>
                    <span className="text-[10px] bg-sky-600 text-white px-2 py-0.5 rounded font-mono">Time Series</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>📅 date</li>
                    <li>📖 subjectId (FK)</li>
                    <li>👥 records [studentId, status]</li>
                    <li>📊 auto % aggregation</li>
                  </ul>
                </div>

                {/* Marks Node */}
                <div className="border border-rose-400 bg-rose-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-2">
                    <span className="font-bold text-rose-900 text-sm">MARKS & SEE</span>
                    <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-mono">Grading</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>📝 ia1 (20) & ia2 (20)</li>
                    <li>📋 assignment (10)</li>
                    <li>🏛️ see (50)</li>
                    <li>🏅 total (100) & SGPA</li>
                  </ul>
                </div>

                {/* Fees Node */}
                <div className="border border-teal-400 bg-teal-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-teal-200 pb-2 mb-2">
                    <span className="font-bold text-teal-900 text-sm">FEES & LEDGER</span>
                    <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded font-mono">Ledger</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>💰 totalFee (₹42,500)</li>
                    <li>💵 paidAmount & pending</li>
                    <li>🧾 receipts & transactions</li>
                  </ul>
                </div>

                {/* Assignments Node */}
                <div className="border border-violet-400 bg-violet-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-violet-200 pb-2 mb-2">
                    <span className="font-bold text-violet-900 text-sm">ASSIGNMENTS</span>
                    <span className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded font-mono">Coursework</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>📌 title & description</li>
                    <li>⏰ dueDate & maxMarks</li>
                    <li>📤 submissions [studentId]</li>
                  </ul>
                </div>

                {/* Notices & Events */}
                <div className="border border-orange-400 bg-orange-50/40 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-orange-200 pb-2 mb-2">
                    <span className="font-bold text-orange-900 text-sm">CIRCULARS & EVENTS</span>
                    <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-mono">Broadcast</span>
                  </div>
                  <ul className="text-xs space-y-1 text-slate-700 font-mono">
                    <li>📢 notices (category, urgency)</li>
                    <li>🗓️ timetable slots</li>
                    <li>🏆 college events (JabinIT)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Detailed MongoDB Mongoose Collection Schemas supporting the REST API specifications:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map((col, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors bg-white shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-blue-700 text-sm">{col.name}</span>
                      <span className="text-[11px] text-slate-500 font-medium">Collection</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{col.desc}</p>
                    <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] space-y-0.5 mb-2">
                      {col.fields.map((f, fi) => (
                        <div key={fi} className="text-emerald-400">
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Relations:</strong> {col.relations.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dataflow' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-blue-300">MERN Architectural Data Flow</h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                  <div className="bg-slate-800 p-4 rounded-lg flex-1 border border-slate-700">
                    <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Frontend (Client)</span>
                    <p className="font-bold text-blue-400">React.js + Tailwind CSS</p>
                    <p className="text-xs text-slate-300 mt-1">Role dashboards, forms, interactive charts, PDF receipts</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0 flex-shrink-0" />
                  <div className="bg-slate-800 p-4 rounded-lg flex-1 border border-slate-700">
                    <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Backend (Server)</span>
                    <p className="font-bold text-emerald-400">Node.js + Express.js</p>
                    <p className="text-xs text-slate-300 mt-1">REST APIs, Auth JWT Middleware, Business Validation</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0 flex-shrink-0" />
                  <div className="bg-slate-800 p-4 rounded-lg flex-1 border border-slate-700">
                    <span className="text-xs uppercase text-slate-400 font-bold block mb-1">Database (Storage)</span>
                    <p className="font-bold text-amber-400">MongoDB + Mongoose</p>
                    <p className="text-xs text-slate-300 mt-1">Persistent collections, aggregation pipelines, indexed queries</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="border border-slate-200 p-4 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">1. Authentication Flow</span>
                  <p className="text-slate-600 leading-relaxed">
                    Client transmits credentials to <code className="bg-slate-100 px-1 py-0.5 rounded">/api/auth/login</code>. Server verifies bcrypt hash, generates role JWT token, and returns user session.
                  </p>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">2. Attendance Pipeline</span>
                  <p className="text-slate-600 leading-relaxed">
                    Faculty inputs daily batch presence. Express server validates teacher permissions, writes session, and computes student aggregate percentages against 75% threshold.
                  </p>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">3. Fee & Receipt Flow</span>
                  <p className="text-slate-600 leading-relaxed">
                    Online transaction updates student fee record, reduces pending amount, triggers transaction ledger entry, and renders downloadable official receipt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors"
          >
            Close Schema Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
