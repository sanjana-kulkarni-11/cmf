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
import { StorageService } from './storage';

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, using local backup:`, err);
    if (fallback) return fallback();
    throw err;
  }
}

export const ApiService = {
  // Health
  getHealth: async () => {
    return fetchJson('/api/health', {}, () => ({
      status: 'ok',
      database: 'MongoDB Document Storage (Active)',
      institution: "K.L.E. Society's P.C. Jabin Science College Autonomous",
      department: "Bachelor of Computer Application (BCA)",
      academicYear: "2026-27"
    }));
  },

  // Authentication
  login: async (emailOrId: string, password?: string): Promise<{ success: boolean; user: User; message: string }> => {
    return fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrId, password })
    });
  },

  register: async (userData: any): Promise<{ success: boolean; user: User; message: string }> => {
    return fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return fetchJson('/api/users', {}, () => StorageService.getUsers());
  },
  addUser: async (user: User): Promise<User> => {
    StorageService.addUser(user);
    return fetchJson('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    }, () => user);
  },

  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    return fetchJson('/api/subjects', {}, () => StorageService.getSubjects());
  },

  // Attendance
  getAttendance: async (): Promise<AttendanceRecord[]> => {
    return fetchJson('/api/attendance', {}, () => StorageService.getAttendance());
  },
  addAttendance: async (record: AttendanceRecord): Promise<AttendanceRecord> => {
    StorageService.addAttendanceSession(record);
    return fetchJson('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(record)
    }, () => record);
  },

  // Marks
  getMarks: async (): Promise<MarksRecord[]> => {
    return fetchJson('/api/marks', {}, () => StorageService.getMarks());
  },
  updateMarks: async (record: MarksRecord): Promise<MarksRecord> => {
    StorageService.updateOrAddMarks(record);
    return fetchJson('/api/marks', {
      method: 'POST',
      body: JSON.stringify(record)
    }, () => record);
  },

  // Fees
  getFees: async (): Promise<FeeItem[]> => {
    return fetchJson('/api/fees', {}, () => StorageService.getFees());
  },
  payFee: async (studentId: string, amount: number, mode: string, ref: string) => {
    StorageService.payFee(studentId, amount, mode as any, ref);
    return fetchJson('/api/fees/pay', {
      method: 'POST',
      body: JSON.stringify({ studentId, amount, mode, ref })
    }, () => null);
  },

  // Assignments
  getAssignments: async (): Promise<Assignment[]> => {
    return fetchJson('/api/assignments', {}, () => StorageService.getAssignments());
  },
  addAssignment: async (asg: Assignment): Promise<Assignment> => {
    StorageService.addAssignment(asg);
    return fetchJson('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(asg)
    }, () => asg);
  },

  // Submissions
  getSubmissions: async (): Promise<Submission[]> => {
    return fetchJson('/api/submissions', {}, () => StorageService.getSubmissions());
  },
  submitWork: async (sub: Submission): Promise<Submission> => {
    StorageService.addOrUpdateSubmission(sub);
    return fetchJson('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(sub)
    }, () => sub);
  },

  // Materials
  getMaterials: async (): Promise<StudyMaterial[]> => {
    return fetchJson('/api/materials', {}, () => StorageService.getMaterials());
  },
  addMaterial: async (mat: StudyMaterial): Promise<StudyMaterial> => {
    StorageService.addMaterial(mat);
    return fetchJson('/api/materials', {
      method: 'POST',
      body: JSON.stringify(mat)
    }, () => mat);
  },

  // Notices
  getNotices: async (): Promise<Notice[]> => {
    return fetchJson('/api/notices', {}, () => StorageService.getNotices());
  },
  addNotice: async (notice: Notice): Promise<Notice> => {
    StorageService.addNotice(notice);
    return fetchJson('/api/notices', {
      method: 'POST',
      body: JSON.stringify(notice)
    }, () => notice);
  },

  // Timetable
  getTimetable: async (): Promise<TimetableSlot[]> => {
    return fetchJson('/api/timetable', {}, () => StorageService.getTimetable());
  },

  // Leaves
  getLeaves: async (): Promise<LeaveRequest[]> => {
    return fetchJson('/api/leaves', {}, () => StorageService.getLeaves());
  },
  addLeave: async (leave: LeaveRequest): Promise<LeaveRequest> => {
    StorageService.addLeave(leave);
    return fetchJson('/api/leaves', {
      method: 'POST',
      body: JSON.stringify(leave)
    }, () => leave);
  },
  updateLeaveStatus: async (id: string, status: string, comment?: string) => {
    StorageService.updateLeaveStatus(id, status as any, comment);
    return fetchJson(`/api/leaves/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment })
    }, () => null);
  },

  // Events
  getEvents: async (): Promise<CollegeEvent[]> => {
    return fetchJson('/api/events', {}, () => StorageService.getEvents());
  },

  // Reset
  resetDatabase: async () => {
    StorageService.resetAll();
    return fetchJson('/api/reset', { method: 'POST' }, () => ({ message: 'Reset' }));
  }
};
