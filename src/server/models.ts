import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: 'pcjabin123' },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  avatar: { type: String },
  phone: { type: String },
  department: { type: String },
  rollNo: { type: String },
  regNo: { type: String },
  semester: { type: Number },
  section: { type: String },
  admissionYear: { type: String },
  guardianName: { type: String },
  guardianPhone: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  staffId: { type: String },
  designation: { type: String },
  qualification: { type: String },
  experience: { type: String },
  specialization: [{ type: String }],
  cabinNo: { type: String }
}, { timestamps: true });

// Subject Schema
export const SubjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  semester: { type: Number, required: true },
  credits: { type: Number, required: true },
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  type: { type: String, enum: ['Theory', 'Practical', 'Core', 'Elective'], required: true },
  totalHours: { type: Number, required: true }
}, { timestamps: true });

// Attendance Schema
export const AttendanceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  subjectId: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  teacherId: { type: String, required: true },
  records: [{
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true }
  }]
}, { timestamps: true });

// Marks Schema
export const MarksSchema = new Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  semester: { type: Number, required: true },
  subjectId: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  ia1: { type: Number, default: 0 },
  ia2: { type: Number, default: 0 },
  assignment: { type: Number, default: 0 },
  see: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  grade: { type: String, default: 'P' },
  gradePoint: { type: Number, default: 4 },
  status: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pass' }
}, { timestamps: true });

// Fees Schema
export const FeeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  totalFee: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  pendingAmount: { type: Number, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Partial', 'Pending', 'Overdue'], required: true },
  breakdown: {
    tuitionFee: { type: Number },
    labFee: { type: Number },
    libraryFee: { type: Number },
    examFee: { type: Number },
    sportsCulturalFee: { type: Number }
  },
  transactions: [{
    id: { type: String },
    amount: { type: Number },
    date: { type: String },
    paymentMode: { type: String },
    transactionRef: { type: String },
    receiptNo: { type: String }
  }]
}, { timestamps: true });

// Assignment Schema
export const AssignmentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  facultyId: { type: String, required: true },
  facultyName: { type: String, required: true },
  assignedDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  maxMarks: { type: Number, default: 10 },
  fileAttachment: { type: String },
  submissionsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Submission Schema
export const SubmissionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  assignmentId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  submittedAt: { type: String, required: true },
  submissionContent: { type: String, required: true },
  fileName: { type: String },
  fileUrl: { type: String },
  status: { type: String, enum: ['Submitted', 'Graded', 'Late'], default: 'Submitted' },
  marksObtained: { type: Number },
  feedback: { type: String }
}, { timestamps: true });

// Study Material Schema
export const MaterialSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  uploadedBy: { type: String, required: true },
  uploadDate: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'doc', 'slides', 'code', 'zip'], default: 'pdf' },
  fileSize: { type: String, default: '2.5 MB' },
  downloads: { type: Number, default: 0 },
  downloadUrl: { type: String }
}, { timestamps: true });

// Notice Schema
export const NoticeSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Examination', 'Event', 'Placement', 'Emergency'], required: true },
  targetRole: { type: String, enum: ['all', 'students', 'teachers'], default: 'all' },
  publishedDate: { type: String, required: true },
  authorName: { type: String, required: true },
  isUrgent: { type: Boolean, default: false }
}, { timestamps: true });

// Timetable Schema
export const TimetableSchema = new Schema({
  id: { type: String, required: true, unique: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  facultyName: { type: String, required: true },
  room: { type: String, required: true },
  semester: { type: Number, required: true },
  type: { type: String, enum: ['Theory', 'Lab'], default: 'Theory' }
}, { timestamps: true });

// Leave Schema
export const LeaveSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  rollOrStaffId: { type: String, required: true },
  leaveType: { type: String, enum: ['Medical', 'Personal', 'Duty Leave', 'Academic Event'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: String, required: true },
  comment: { type: String }
}, { timestamps: true });

// Event Schema
export const EventSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true },
  organizer: { type: String, required: true }
}, { timestamps: true });
