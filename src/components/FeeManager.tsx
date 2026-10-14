import React, { useState } from 'react';
import { User, FeeItem } from '../types';
import { COLLEGE_INFO } from '../data/mockDatabase';
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Printer,
  Download,
  Receipt,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles
} from 'lucide-react';

interface FeeManagerProps {
  currentUser: User;
  allUsers: User[];
  fees: FeeItem[];
  onPayFee: (studentId: string, amount: number, mode: 'Online' | 'UPI' | 'NetBanking' | 'Challan', ref: string) => void;
}

export const FeeManager: React.FC<FeeManagerProps> = ({
  currentUser,
  allUsers,
  fees,
  onPayFee
}) => {
  const students = allUsers.filter(u => u.role === 'student');

  // Selected student for view (default to current user if student, otherwise first student)
  const [selectedStudentId, setSelectedStudentId] = useState(
    currentUser.role === 'student' ? currentUser.id : students[0]?.id || ''
  );
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(12500);
  const [payMode, setPayMode] = useState<'Online' | 'UPI' | 'NetBanking' | 'Challan'>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<{
    receiptNo: string;
    date: string;
    amount: number;
    mode: string;
    ref: string;
    studentName: string;
    rollNo: string;
  } | null>(null);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeFee = fees.find(f => f.studentId === activeStudent?.id);

  // Admin aggregates
  const totalTarget = fees.reduce((acc, f) => acc + f.totalFee, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.pendingAmount, 0);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFee || payAmount <= 0) return;

    const ref = transactionRef.trim() || `UPI${Date.now().toString().slice(-8)}`;
    onPayFee(activeFee.studentId, payAmount, payMode, ref);
    setIsPayModalOpen(false);
  };

  const openReceipt = (tx: { receiptNo: string; date: string; amount: number; paymentMode: string; transactionRef: string }) => {
    setSelectedReceipt({
      receiptNo: tx.receiptNo,
      date: tx.date,
      amount: tx.amount,
      mode: tx.paymentMode,
      ref: tx.transactionRef,
      studentName: activeFee?.studentName || '',
      rollNo: activeFee?.rollNo || ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Academic Fee Management & Online Ledger</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            K.L.E. Society's P.C. Jabin Science College Autonomous • Academic Year 2026-27
          </p>
        </div>

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
      </div>

      {/* Admin Overall Overview Cards */}
      {currentUser.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Fee Target</span>
            <span className="text-2xl font-extrabold text-slate-900">₹{totalTarget.toLocaleString()}</span>
            <p className="text-xs text-slate-500 mt-1">BCA Department 2026-27</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Collected</span>
            <span className="text-2xl font-extrabold text-emerald-700">₹{totalCollected.toLocaleString()}</span>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {Math.round((totalCollected / totalTarget) * 100)}% realization rate
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Outstanding Pending</span>
            <span className="text-2xl font-extrabold text-amber-700">₹{totalPending.toLocaleString()}</span>
            <p className="text-xs text-slate-500 mt-1">Due before Nov 15, 2026</p>
          </div>
        </div>
      )}

      {/* Student Fee Ledger Card */}
      {activeFee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fee Overview & Pay Action */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Account Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeFee.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeFee.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{activeFee.studentName}</h3>
              <p className="text-xs text-slate-500 font-mono">Roll: {activeFee.rollNo} • BCA Sem {activeFee.semester}</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Total Prescribed Fee:</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Amount Paid to Date:</span>
                <span className="font-bold text-emerald-700 font-mono">₹{activeFee.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800">Remaining Balance:</span>
                <span className="font-extrabold text-rose-700 font-mono text-sm">
                  ₹{activeFee.pendingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {activeFee.pendingAmount > 0 ? (
              <button
                onClick={() => {
                  setPayAmount(activeFee.pendingAmount);
                  setIsPayModalOpen(true);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Pay Remaining Balance Online</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Full Academic Fee Cleared for 2026-27</span>
              </div>
            )}

            <div className="text-[11px] text-slate-500 space-y-1">
              <p>Due Date: <strong className="text-slate-700">{activeFee.dueDate}</strong></p>
              <p>Bank: Canara Bank, Vidyanagar Hubballi Branch</p>
            </div>
          </div>

          {/* Fee Components Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <span>Official Fee Structure Breakdown</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Tuition & Academic Fee</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.breakdown.tuitionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Computer Laboratory & Internet</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.breakdown.labFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Library & Digital E-Journals</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.breakdown.libraryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Autonomous Examination Fee</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.breakdown.examFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Sports, Cultural & Development</span>
                <span className="font-bold text-slate-900 font-mono">₹{activeFee.breakdown.sportsCulturalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-bold">
                <span>Total Annual Prescribed Fee</span>
                <span className="font-mono text-sm">₹{activeFee.totalFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment History & Receipts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Transaction History & Receipts</span>
            </h3>

            {activeFee.transactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No payment transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {activeFee.transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="p-3.5 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-white shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 text-xs">
                        ₹{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Success
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                      <p>Date: {tx.date} • Mode: {tx.paymentMode}</p>
                      <p>Ref: {tx.transactionRef}</p>
                      <p className="text-blue-700 font-semibold">{tx.receiptNo}</p>
                    </div>
                    <button
                      onClick={() => openReceipt(tx)}
                      className="mt-2.5 w-full py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Official Fee Receipt</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Online Payment Simulator Modal */}
      {isPayModalOpen && activeFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Make Online Fee Payment</h3>
                <p className="text-xs text-slate-500">{activeFee.studentName} ({activeFee.rollNo})</p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min={100}
                  max={activeFee.pendingAmount}
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pending Due: ₹{activeFee.pendingAmount.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Online', 'NetBanking', 'Challan'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPayMode(mode)}
                      className={`p-2 rounded-lg font-semibold border text-center transition-colors ${
                        payMode === mode
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {mode === 'UPI' ? 'Google Pay / PhonePe' : mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transaction Reference / UTR (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm & Pay ₹{payAmount.toLocaleString()}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Fee Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-slate-300 my-8">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
                {COLLEGE_INFO.institution}
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {COLLEGE_INFO.name}
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                ({COLLEGE_INFO.status}) • {COLLEGE_INFO.affiliation}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {COLLEGE_INFO.location}
              </p>
              <div className="pt-2">
                <span className="px-3 py-0.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded">
                  Official Academic Fee Receipt
                </span>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200 text-xs">
              <div className="space-y-1 font-mono">
                <p>Receipt No: <strong className="text-slate-900 font-bold">{selectedReceipt.receiptNo}</strong></p>
                <p>Date: <strong>{selectedReceipt.date}</strong></p>
                <p>Mode: <strong>{selectedReceipt.mode}</strong></p>
              </div>
              <div className="space-y-1 text-right font-mono">
                <p>Txn Ref: <strong className="text-slate-900">{selectedReceipt.ref}</strong></p>
                <p>Student: <strong className="text-slate-900">{selectedReceipt.studentName}</strong></p>
                <p>Roll No: <strong>{selectedReceipt.rollNo}</strong></p>
              </div>
            </div>

            {/* Amount Paid Box */}
            <div className="py-6 my-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold uppercase text-emerald-800">Amount Received</span>
              <p className="text-3xl font-black text-emerald-900 font-mono">
                ₹{selectedReceipt.amount.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700">
                Payment verified and credited to College Autonomous Account
              </p>
            </div>

            {/* Footer with Seal */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="text-[10px]">
                <p className="font-bold text-slate-800">Computer Generated E-Receipt</p>
                <p>K.L.E. Society's P.C. Jabin Science College</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-8 border-b border-dashed border-slate-400 mb-1" />
                <span className="text-[10px] font-semibold">Authorized Finance Officer</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs"
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
