import React, { useState } from 'react';
import { User, LeaveRequest } from '../types';
import {
  FileText,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  X,
  Send,
  UserCheck
} from 'lucide-react';

interface LeaveManagerProps {
  currentUser: User;
  leaves: LeaveRequest[];
  onAddLeave: (leave: LeaveRequest) => void;
  onUpdateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected', comment?: string) => void;
}

export const LeaveManager: React.FC<LeaveManagerProps> = ({
  currentUser,
  leaves,
  onAddLeave,
  onUpdateLeaveStatus
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'Medical' | 'Personal' | 'Duty Leave' | 'Academic Event'>('Medical');
  const [startDate, setStartDate] = useState('2026-10-20');
  const [endDate, setEndDate] = useState('2026-10-21');
  const [reason, setReason] = useState('');

  // Comment for approval
  const [approvingLeaveId, setApprovingLeaveId] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState('Sanctioned as requested.');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    const newLeave: LeaveRequest = {
      id: `lv_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      rollOrStaffId: currentUser.rollNo || currentUser.staffId || '224048',
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    onAddLeave(newLeave);
    setIsApplyModalOpen(false);
    setReason('');
  };

  const handleDecision = (leaveId: string, status: 'Approved' | 'Rejected') => {
    onUpdateLeaveStatus(leaveId, status, adminComment);
    setApprovingLeaveId(null);
  };

  const filteredLeaves = leaves.filter(l => {
    if (currentUser.role === 'student') {
      return l.userId === currentUser.id;
    }
    return true; // Admin and Teachers see all applications
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Digital Leave Application & Sanction Portal</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Department of BCA • Online leave submissions, medical certificates & approval tracking
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leaves Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeaves.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    item.leaveType === 'Medical'
                      ? 'bg-rose-100 text-rose-800'
                      : item.leaveType === 'Academic Event'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {item.leaveType}
                </span>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    item.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5" />}
                  {item.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                  {item.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                  <span>{item.status}</span>
                </span>
              </div>

              <div className="mb-2">
                <h3 className="font-bold text-slate-900 text-base">{item.userName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {item.userRole === 'student' ? `Roll No: ${item.rollOrStaffId}` : `Staff ID: ${item.rollOrStaffId}`}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5 mb-3">
                <div className="flex items-center gap-2 font-mono font-medium text-slate-800">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Duration: {item.startDate} to {item.endDate}</span>
                </div>
                <p className="pt-1 border-t border-slate-200/60 leading-relaxed">
                  Reason: "{item.reason}"
                </p>
              </div>

              {item.comment && (
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 mb-3">
                  <strong>Remarks by Authority:</strong> {item.comment}
                </div>
              )}
            </div>

            {/* Authority Approval Actions */}
            {currentUser.role !== 'student' && item.status === 'Pending' && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleDecision(item.id, 'Rejected')}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleDecision(item.id, 'Approved')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Sanction Leave</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Submit Leave Request</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Leave Category *</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="Medical">Medical Leave (Sick / Health)</option>
                  <option value="Academic Event">Academic / Competition Duty Leave</option>
                  <option value="Personal">Personal / Family Urgent Affair</option>
                  <option value="Duty Leave">Institutional Duty Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detailed Reason *</label>
                <textarea
                  rows={4}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="State the justification for leave application..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px]">
                Applicant: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()}). The request will be forwarded to Department HOD & Academic Principal for approval.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Leave Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
