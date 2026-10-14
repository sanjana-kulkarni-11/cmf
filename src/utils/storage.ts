import {
  User,
  Subject,
  AttendanceRecord,
  MarksRecord,
  FeeItem,
  Assignment,
  Submission,
  StudyMaterial,
  Notice,
  TimetableSlot,
  LeaveRequest,
  CollegeEvent
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_FEES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_NOTICES,
  INITIAL_TIMETABLE,
  INITIAL_LEAVES,
  INITIAL_EVENTS
} from '../data/mockDatabase';

const STORAGE_KEYS = {
  USERS: 'pc_jabin_cms_users_v1',
  SUBJECTS: 'pc_jabin_cms_subjects_v1',
  ATTENDANCE: 'pc_jabin_cms_attendance_v1',
  MARKS: 'pc_jabin_cms_marks_v1',
  FEES: 'pc_jabin_cms_fees_v1',
  ASSIGNMENTS: 'pc_jabin_cms_assignments_v1',
  SUBMISSIONS: 'pc_jabin_cms_submissions_v1',
  MATERIALS: 'pc_jabin_cms_materials_v1',
  NOTICES: 'pc_jabin_cms_notices_v1',
  TIMETABLE: 'pc_jabin_cms_timetable_v1',
  LEAVES: 'pc_jabin_cms_leaves_v1',
  EVENTS: 'pc_jabin_cms_events_v1',
  CURRENT_USER: 'pc_jabin_cms_curr_user_v1'
};

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
}

export const StorageService = {
  // Users
  getUsers: (): User[] => getStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: User[]) => setStoredItem(STORAGE_KEYS.USERS, users),
  addUser: (user: User) => {
    const users = StorageService.getUsers();
    users.push(user);
    StorageService.saveUsers(users);
  },

  // Subjects
  getSubjects: (): Subject[] => getStoredItem(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  saveSubjects: (subjects: Subject[]) => setStoredItem(STORAGE_KEYS.SUBJECTS, subjects),

  // Attendance
  getAttendance: (): AttendanceRecord[] => getStoredItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  saveAttendance: (records: AttendanceRecord[]) => setStoredItem(STORAGE_KEYS.ATTENDANCE, records),
  addAttendanceSession: (record: AttendanceRecord) => {
    const list = StorageService.getAttendance();
    list.unshift(record);
    StorageService.saveAttendance(list);
  },

  // Marks
  getMarks: (): MarksRecord[] => getStoredItem(STORAGE_KEYS.MARKS, INITIAL_MARKS),
  saveMarks: (marks: MarksRecord[]) => setStoredItem(STORAGE_KEYS.MARKS, marks),
  updateOrAddMarks: (mark: MarksRecord) => {
    const list = StorageService.getMarks();
    const idx = list.findIndex(m => m.id === mark.id || (m.studentId === mark.studentId && m.subjectId === mark.subjectId));
    if (idx >= 0) {
      list[idx] = mark;
    } else {
      list.push(mark);
    }
    StorageService.saveMarks(list);
  },

  // Fees
  getFees: (): FeeItem[] => getStoredItem(STORAGE_KEYS.FEES, INITIAL_FEES),
  saveFees: (fees: FeeItem[]) => setStoredItem(STORAGE_KEYS.FEES, fees),
  payFee: (studentId: string, amount: number, mode: 'Online' | 'UPI' | 'NetBanking' | 'Challan', ref: string) => {
    const list = StorageService.getFees();
    const item = list.find(f => f.studentId === studentId);
    if (!item) return null;

    const receiptNo = `REC-2026-BCA-${Date.now().toString().slice(-5)}`;
    const newTx = {
      id: `tx_${Date.now()}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMode: mode,
      transactionRef: ref || `TXN${Date.now()}`,
      receiptNo
    };

    item.paidAmount += amount;
    item.pendingAmount = Math.max(0, item.totalFee - item.paidAmount);
    item.status = item.pendingAmount === 0 ? 'Paid' : 'Partial';
    item.transactions.unshift(newTx);
    StorageService.saveFees(list);
    return newTx;
  },

  // Assignments
  getAssignments: (): Assignment[] => getStoredItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
  saveAssignments: (assignments: Assignment[]) => setStoredItem(STORAGE_KEYS.ASSIGNMENTS, assignments),
  addAssignment: (asg: Assignment) => {
    const list = StorageService.getAssignments();
    list.unshift(asg);
    StorageService.saveAssignments(list);
  },

  // Submissions
  getSubmissions: (): Submission[] => getStoredItem(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS),
  saveSubmissions: (submissions: Submission[]) => setStoredItem(STORAGE_KEYS.SUBMISSIONS, submissions),
  addOrUpdateSubmission: (sub: Submission) => {
    const list = StorageService.getSubmissions();
    const idx = list.findIndex(s => s.id === sub.id || (s.assignmentId === sub.assignmentId && s.studentId === sub.studentId));
    if (idx >= 0) {
      list[idx] = sub;
    } else {
      list.unshift(sub);
    }
    StorageService.saveSubmissions(list);
  },

  // Study Materials
  getMaterials: (): StudyMaterial[] => getStoredItem(STORAGE_KEYS.MATERIALS, INITIAL_STUDY_MATERIALS),
  saveMaterials: (mats: StudyMaterial[]) => setStoredItem(STORAGE_KEYS.MATERIALS, mats),
  addMaterial: (mat: StudyMaterial) => {
    const list = StorageService.getMaterials();
    list.unshift(mat);
    StorageService.saveMaterials(list);
  },

  // Notices
  getNotices: (): Notice[] => getStoredItem(STORAGE_KEYS.NOTICES, INITIAL_NOTICES),
  saveNotices: (notices: Notice[]) => setStoredItem(STORAGE_KEYS.NOTICES, notices),
  addNotice: (notice: Notice) => {
    const list = StorageService.getNotices();
    list.unshift(notice);
    StorageService.saveNotices(list);
  },

  // Timetable
  getTimetable: (): TimetableSlot[] => getStoredItem(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE),
  saveTimetable: (slots: TimetableSlot[]) => setStoredItem(STORAGE_KEYS.TIMETABLE, slots),

  // Leave Requests
  getLeaves: (): LeaveRequest[] => getStoredItem(STORAGE_KEYS.LEAVES, INITIAL_LEAVES),
  saveLeaves: (leaves: LeaveRequest[]) => setStoredItem(STORAGE_KEYS.LEAVES, leaves),
  addLeave: (leave: LeaveRequest) => {
    const list = StorageService.getLeaves();
    list.unshift(leave);
    StorageService.saveLeaves(list);
  },
  updateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    const list = StorageService.getLeaves();
    const item = list.find(l => l.id === leaveId);
    if (item) {
      item.status = status;
      if (comment) item.comment = comment;
      StorageService.saveLeaves(list);
    }
  },

  // Events
  getEvents: (): CollegeEvent[] => getStoredItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS),
  saveEvents: (events: CollegeEvent[]) => setStoredItem(STORAGE_KEYS.EVENTS, events),
  addEvent: (evt: CollegeEvent) => {
    const list = StorageService.getEvents();
    list.unshift(evt);
    StorageService.saveEvents(list);
  },

  // Current session User
  getCurrentUser: (): User => {
    // Default to Sanjana Kulkarni (Student) or Admin
    return getStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[4]); // Sanjana Kulkarni
  },
  setCurrentUser: (user: User) => {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Reset to default
  resetAll: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
