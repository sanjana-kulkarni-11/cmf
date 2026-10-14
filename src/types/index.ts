export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  // Student-specific
  rollNo?: string;
  regNo?: string;
  semester?: number;
  section?: string;
  admissionYear?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  bloodGroup?: string;
  // Faculty-specific
  staffId?: string;
  designation?: string;
  qualification?: string;
  experience?: string;
  specialization?: string[];
  cabinNo?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName: string;
  type: 'Theory' | 'Practical' | 'Core' | 'Elective';
  totalHours: number;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  section: string;
  teacherId: string;
  records: {
    studentId: string;
    studentName: string;
    rollNo: string;
    status: 'present' | 'absent' | 'late';
  }[];
}

export interface MarksRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  semester: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  ia1: number; // Max 20
  ia2: number; // Max 20
  assignment: number; // Max 10
  see: number; // Max 50
  total: number; // Max 100
  grade: string;
  gradePoint: number;
  status: 'Pass' | 'Fail' | 'Pending';
}

export interface FeeItem {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  semester: number;
  academicYear: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  breakdown: {
    tuitionFee: number;
    labFee: number;
    libraryFee: number;
    examFee: number;
    sportsCulturalFee: number;
  };
  transactions: {
    id: string;
    amount: number;
    date: string;
    paymentMode: 'Online' | 'UPI' | 'NetBanking' | 'Challan';
    transactionRef: string;
    receiptNo: string;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  facultyId: string;
  facultyName: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  fileAttachment?: string;
  submissionsCount?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt: string;
  submissionContent: string;
  fileName?: string;
  fileUrl?: string;
  status: 'Submitted' | 'Graded' | 'Late';
  marksObtained?: number;
  feedback?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  uploadedBy: string;
  uploadDate: string;
  fileType: 'pdf' | 'doc' | 'slides' | 'code' | 'zip';
  fileSize: string;
  downloads: number;
  downloadUrl?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Examination' | 'Event' | 'Placement' | 'Emergency';
  targetRole: 'all' | 'students' | 'teachers';
  publishedDate: string;
  authorName: string;
  isUrgent?: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  semester: number;
  type: 'Theory' | 'Lab';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  rollOrStaffId: string;
  leaveType: 'Medical' | 'Personal' | 'Duty Leave' | 'Academic Event';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  comment?: string;
}

export interface CollegeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Seminar' | 'Examination';
  organizer: string;
}
