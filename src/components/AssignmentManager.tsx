import React, { useState } from 'react';
import { User, Assignment, Submission, Subject } from '../types';
import {
  FileText,
  PlusCircle,
  UploadCloud,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
  Edit,
  X,
  FileCheck,
  Send,
  AlertCircle
} from 'lucide-react';

interface AssignmentManagerProps {
  currentUser: User;
  allUsers: User[];
  subjects: Subject[];
  assignments: Assignment[];
  submissions: Submission[];
  onAddAssignment: (asg: Assignment) => void;
  onSubmitWork: (sub: Submission) => void;
}

export const AssignmentManager: React.FC<AssignmentManagerProps> = ({
  currentUser,
  allUsers,
  subjects,
  assignments,
  submissions,
  onAddAssignment,
  onSubmitWork
}) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'grading'>('assignments');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Grading modal state
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmissionToGrade, setActiveSubmissionToGrade] = useState<Submission | null>(null);
  const [marksGiven, setMarksGiven] = useState(9.5);
  const [feedbackGiven, setFeedbackGiven] = useState('Well executed implementation.');

  // Create Assignment Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-10-28');
  const [maxMarks, setMaxMarks] = useState(10);
  const [attachmentName, setAttachmentName] = useState('Lab_Assignment_Guide.pdf');

  // Submit Solution Form
  const [submissionContent, setSubmissionContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const sub = subjects.find(s => s.id === subjectId) || subjects[0];
    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      title,
      description,
      subjectId: sub.id,
      subjectName: sub.name,
      semester: 5,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      maxMarks,
      fileAttachment: attachmentName,
      submissionsCount: 0
    };

    onAddAssignment(newAsg);
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAssignment(asg);
    const existing = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);
    if (existing) {
      setSubmissionContent(existing.submissionContent);
      setFileName(existing.fileName || '');
    } else {
      setSubmissionContent('');
      setFileName(`${currentUser.name.replace(/\s+/g, '_')}_Roll_${currentUser.rollNo}_Solution.zip`);
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const newSub: Submission = {
      id: `subm_${Date.now()}`,
      assignmentId: selectedAssignment.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rollNo: currentUser.rollNo || '224048',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      submissionContent,
      fileName: fileName || `${currentUser.name}_Assignment.zip`,
      status: 'Submitted'
    };

    onSubmitWork(newSub);
    setIsSubmitModalOpen(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionToGrade) return;

    const updated: Submission = {
      ...activeSubmissionToGrade,
      status: 'Graded',
      marksObtained: marksGiven,
      feedback: feedbackGiven
    };

    onSubmitWork(updated);
    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Assignments & Continuous Internal Evaluation Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Coursework Submissions, Source Code Reviews & Faculty Feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'student' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs for Faculty / Admin */}
      {currentUser.role !== 'student' && (
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 rounded-t-2xl gap-2">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Published Assignments ({assignments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'grading' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Student Submissions & Evaluation ({submissions.length})</span>
          </button>
        </div>
      )}

      {/* Assignments List */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map(asg => {
            const userSub = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {asg.subjectName}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      Max: {asg.maxMarks} Marks
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-2">{asg.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Faculty Guide:</span>
                      <strong className="text-slate-700">{asg.facultyName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <strong className="text-rose-700 font-mono">{asg.dueDate}</strong>
                    </div>
                    {asg.fileAttachment && (
                      <div className="flex justify-between items-center text-blue-600 pt-1 border-t border-slate-200/60">
                        <span>Resource:</span>
                        <span className="font-semibold">{asg.fileAttachment}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Action */}
                <div className="pt-3 border-t border-slate-100">
                  {currentUser.role === 'student' ? (
                    <div>
                      {userSub ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {userSub.status === 'Graded' ? 'Graded' : 'Submitted'}
                            </span>
                            {userSub.status === 'Graded' && (
                              <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                {userSub.marksObtained} / {asg.maxMarks}
                              </span>
                            )}
                          </div>
                          {userSub.feedback && (
                            <p className="text-[11px] text-slate-600 italic bg-blue-50/50 p-2 rounded border border-blue-100">
                              "{userSub.feedback}"
                            </p>
                          )}
                          <button
                            onClick={() => handleOpenSubmit(asg)}
                            className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Update Submission
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenSubmit(asg)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>Submit Solution</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Total Submissions:</span>
                      <strong className="text-slate-900 font-mono">
                        {submissions.filter(s => s.assignmentId === asg.id).length} Received
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submissions & Evaluation Table for Faculty */}
      {activeTab === 'grading' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Student Coursework Submissions</h3>
              <p className="text-xs text-slate-500">Review project solutions and assign CIE internal marks</p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-semibold">
              {submissions.length} Total Submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Assignment</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4">Attached Solution</th>
                  <th className="py-3 px-3 text-center">Marks</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map(sub => {
                  const asg = assignments.find(a => a.id === sub.assignmentId);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">{sub.rollNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{sub.studentName}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{asg?.title}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{sub.submittedAt}</td>
                      <td className="py-3 px-4 font-mono text-blue-700 font-medium">
                        {sub.fileName || 'Solution_Archive.zip'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {sub.marksObtained !== undefined ? `${sub.marksObtained} / 10` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            sub.status === 'Graded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveSubmissionToGrade(sub);
                            setMarksGiven(sub.marksObtained ?? 9.5);
                            setFeedbackGiven(sub.feedback || 'Excellent code structure and documentation.');
                            setIsGradeModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>{sub.status === 'Graded' ? 'Edit Grade' : 'Evaluate'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Publish Course Assignment</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. MERN Full Stack CRUD API with JWT Authentication"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject / Course Unit *</label>
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Problem Statement & Guidelines *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe requirements, deliverables, and submission specifications..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    value={maxMarks}
                    onChange={e => setMaxMarks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Solution Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Submit Assignment Solution</h3>
                <p className="text-xs text-slate-500">{selectedAssignment.title}</p>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Solution Notes & GitHub / Hosting URL *
                </label>
                <textarea
                  rows={4}
                  required
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  placeholder="Provide repository URL, technical notes, endpoint documentation, and key observations..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Archive / File Attachment Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. Sanjana_224048_Project_API.zip"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                Submitting as <strong>{currentUser.name}</strong> (Roll: {currentUser.rollNo} • BCA Sem V). This coursework will be evaluated by {selectedAssignment.facultyName}.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Coursework</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal for Faculty */}
      {isGradeModalOpen && activeSubmissionToGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Evaluate Student Submission</h3>
                <p className="text-xs text-slate-500">
                  {activeSubmissionToGrade.studentName} (Roll: {activeSubmissionToGrade.rollNo})
                </p>
              </div>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-36 overflow-y-auto">
                <span className="font-semibold block mb-1 text-slate-900">Student Solution Notes:</span>
                <p className="whitespace-pre-wrap">{activeSubmissionToGrade.submissionContent}</p>
                {activeSubmissionToGrade.fileName && (
                  <p className="mt-2 text-[11px] font-mono text-blue-700 font-bold">
                    File: {activeSubmissionToGrade.fileName}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Marks Awarded (Max 10) *</label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  max={10}
                  required
                  value={marksGiven}
                  onChange={e => setMarksGiven(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty Feedback Remarks</label>
                <textarea
                  rows={3}
                  value={feedbackGiven}
                  onChange={e => setFeedbackGiven(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow"
                >
                  Record Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
