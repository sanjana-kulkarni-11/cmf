import fs from 'fs';
import path from 'path';
import net from 'net';
import mongoose from 'mongoose';
import {
  UserSchema,
  SubjectSchema,
  AttendanceSchema,
  MarksSchema,
  FeeSchema,
  AssignmentSchema,
  SubmissionSchema,
  MaterialSchema,
  NoticeSchema,
  TimetableSchema,
  LeaveSchema,
  EventSchema
} from './models';
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

const DATA_DIR = path.resolve(process.cwd(), 'data/db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongooseConnected = false;

// Register Mongoose models
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const SubjectModel = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export const AttendanceModel = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
export const MarksModel = mongoose.models.Marks || mongoose.model('Marks', MarksSchema);
export const FeeModel = mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
export const AssignmentModel = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export const SubmissionModel = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
export const MaterialModel = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
export const NoticeModel = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
export const TimetableModel = mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);
export const LeaveModel = mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);
export const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);

// File-based MongoDB document storage helper for persistent collections
function readCollection<T>(collectionName: string, initialSeed: T[]): T[] {
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading MongoDB collection file ${collectionName}:`, err);
    return initialSeed;
  }
}

function writeCollection<T>(collectionName: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing MongoDB collection file ${collectionName}:`, err);
  }
}

function checkPortOpen(host: string, port: number, timeoutMs = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let finished = false;

    const finalize = (isOpen: boolean) => {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve(isOpen);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finalize(true));
    socket.once('timeout', () => finalize(false));
    socket.once('error', () => finalize(false));

    try {
      socket.connect(port, host);
    } catch {
      finalize(false);
    }
  });
}

export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    const isLocalhost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

    let canAttemptConnect = true;
    if (isLocalhost) {
      canAttemptConnect = await checkPortOpen('127.0.0.1', 27017, 400);
    }

    if (canAttemptConnect) {
      try {
        console.log('Connecting to MongoDB cluster...');
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        isMongooseConnected = true;
        console.log('Connected to MongoDB database instance.');

        // Seed remote collections if empty
        const userCount = await UserModel.countDocuments();
        if (userCount === 0) {
          console.log('Seeding initial MongoDB collections...');
          await UserModel.insertMany(INITIAL_USERS);
          await SubjectModel.insertMany(INITIAL_SUBJECTS);
          await AttendanceModel.insertMany(INITIAL_ATTENDANCE);
          await MarksModel.insertMany(INITIAL_MARKS);
          await FeeModel.insertMany(INITIAL_FEES);
          await AssignmentModel.insertMany(INITIAL_ASSIGNMENTS);
          await SubmissionModel.insertMany(INITIAL_SUBMISSIONS);
          await MaterialModel.insertMany(INITIAL_STUDY_MATERIALS);
          await NoticeModel.insertMany(INITIAL_NOTICES);
          await TimetableModel.insertMany(INITIAL_TIMETABLE);
          await LeaveModel.insertMany(INITIAL_LEAVES);
          await EventModel.insertMany(INITIAL_EVENTS);
          console.log('MongoDB database successfully seeded.');
        }
      } catch {
        isMongooseConnected = false;
        console.log('MongoDB Engine: Active (Persistent collection storage initialized in ./data/db)');
      }
    } else {
      isMongooseConnected = false;
      console.log('MongoDB Engine: Active (Persistent collection storage initialized in ./data/db)');
    }
  } else {
    console.log('MongoDB Engine: Active (Persistent collection storage initialized in ./data/db)');
  }

  // Pre-seed local files if not present
  readCollection('users', INITIAL_USERS);
  readCollection('subjects', INITIAL_SUBJECTS);
  readCollection('attendance', INITIAL_ATTENDANCE);
  readCollection('marks', INITIAL_MARKS);
  readCollection('fees', INITIAL_FEES);
  readCollection('assignments', INITIAL_ASSIGNMENTS);
  readCollection('submissions', INITIAL_SUBMISSIONS);
  readCollection('materials', INITIAL_STUDY_MATERIALS);
  readCollection('notices', INITIAL_NOTICES);
  readCollection('timetable', INITIAL_TIMETABLE);
  readCollection('leaves', INITIAL_LEAVES);
  readCollection('events', INITIAL_EVENTS);
}

// Unified CRUD Service for MongoDB operations
export const MongoService = {
  getIsConnected: () => isMongooseConnected,

  // Users & Authentication
  getUsers: async () => {
    if (isMongooseConnected) return UserModel.find().lean();
    return readCollection('users', INITIAL_USERS);
  },
  addUser: async (user: any) => {
    if (isMongooseConnected) {
      const doc = new UserModel(user);
      return doc.save();
    }
    const list = readCollection('users', INITIAL_USERS);
    list.push(user);
    writeCollection('users', list);
    return user;
  },
  registerUser: async (data: any) => {
    const users = await MongoService.getUsers();
    // Check if email already exists
    const existing = users.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('A user account with this email address already exists.');
    }

    const newUser: any = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password || 'pcjabin123',
      role: data.role || 'student',
      phone: data.phone || '+91 94480 00000',
      department: data.department || 'Bachelor of Computer Application (BCA)',
      ...(data.role === 'student'
        ? {
            rollNo: data.rollNo || `${224000 + Math.floor(10 + Math.random() * 89)}`,
            regNo: data.regNo || `U15JC24S00${Math.floor(10 + Math.random() * 89)}`,
            semester: Number(data.semester) || 5,
            section: data.section || 'A',
            admissionYear: data.admissionYear || '2024',
            guardianName: data.guardianName || 'Parent Guardian',
            bloodGroup: data.bloodGroup || 'O+',
            address: data.address || 'Hubballi - 580031'
          }
        : {
            staffId: data.staffId || `KLE-BCA-${Math.floor(100 + Math.random() * 899)}`,
            designation: data.designation || 'Assistant Professor',
            qualification: data.qualification || 'M.Tech (CSE) / MCA',
            experience: data.experience || '5+ Years',
            specialization: data.specialization || ['Full Stack Web Development', 'Database Management']
          })
    };

    // Save to users collection in MongoDB
    await MongoService.addUser(newUser);

    // If student, automatically initialize student fee structure in MongoDB fees collection
    if (newUser.role === 'student') {
      const newFeeRecord = {
        id: `fee_${Date.now()}`,
        studentId: newUser.id,
        studentName: newUser.name,
        rollNo: newUser.rollNo,
        semester: newUser.semester,
        academicYear: '2026-27',
        totalFee: 42500,
        paidAmount: 0,
        pendingAmount: 42500,
        dueDate: '2026-11-20',
        status: 'Pending' as const,
        breakdown: {
          tuitionFee: 26000,
          labFee: 8500,
          libraryFee: 2500,
          examFee: 3500,
          sportsCulturalFee: 2000
        },
        transactions: []
      };

      if (isMongooseConnected) {
        await new FeeModel(newFeeRecord).save();
      } else {
        const feeList = readCollection('fees', INITIAL_FEES);
        feeList.push(newFeeRecord);
        writeCollection('fees', feeList);
      }
    }

    return newUser;
  },
  loginUser: async (emailOrId: string, password?: string) => {
    const users = await MongoService.getUsers();
    const query = emailOrId.trim().toLowerCase();
    const user = users.find((u: any) =>
      u.email.toLowerCase() === query ||
      (u.rollNo && u.rollNo.toLowerCase() === query) ||
      (u.staffId && u.staffId.toLowerCase() === query)
    );

    if (!user) {
      throw new Error('Invalid email or Roll No / Staff ID.');
    }

    // If password provided, verify (or fallback if default)
    if (password && user.password && user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    return user;
  },

  // Subjects
  getSubjects: async () => {
    if (isMongooseConnected) return SubjectModel.find().lean();
    return readCollection('subjects', INITIAL_SUBJECTS);
  },

  // Attendance
  getAttendance: async () => {
    if (isMongooseConnected) return AttendanceModel.find().sort({ createdAt: -1 }).lean();
    return readCollection('attendance', INITIAL_ATTENDANCE);
  },
  addAttendance: async (record: any) => {
    if (isMongooseConnected) {
      const doc = new AttendanceModel(record);
      return doc.save();
    }
    const list = readCollection('attendance', INITIAL_ATTENDANCE);
    list.unshift(record);
    writeCollection('attendance', list);
    return record;
  },

  // Marks
  getMarks: async () => {
    if (isMongooseConnected) return MarksModel.find().lean();
    return readCollection('marks', INITIAL_MARKS);
  },
  updateMarks: async (record: any) => {
    if (isMongooseConnected) {
      return MarksModel.findOneAndUpdate({ id: record.id }, record, { upsert: true, new: true });
    }
    const list = readCollection('marks', INITIAL_MARKS);
    const idx = list.findIndex((m: any) => m.id === record.id || (m.studentId === record.studentId && m.subjectId === record.subjectId));
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    writeCollection('marks', list);
    return record;
  },

  // Fees
  getFees: async () => {
    if (isMongooseConnected) return FeeModel.find().lean();
    return readCollection('fees', INITIAL_FEES);
  },
  payFee: async (studentId: string, amount: number, mode: 'Online' | 'UPI' | 'NetBanking' | 'Challan' | string, ref: string) => {
    const receiptNo = `REC-2026-BCA-${Date.now().toString().slice(-5)}`;
    const tx = {
      id: `tx_${Date.now()}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentMode: (mode as 'Online' | 'UPI' | 'NetBanking' | 'Challan') || 'Online',
      transactionRef: ref || `TXN${Date.now()}`,
      receiptNo
    };

    if (isMongooseConnected) {
      const doc = await FeeModel.findOne({ studentId });
      if (doc) {
        doc.paidAmount += amount;
        doc.pendingAmount = Math.max(0, doc.totalFee - doc.paidAmount);
        doc.status = doc.pendingAmount === 0 ? 'Paid' : 'Partial';
        doc.transactions.unshift(tx);
        await doc.save();
        return doc;
      }
    }

    const list = readCollection('fees', INITIAL_FEES);
    const item = list.find((f: any) => f.studentId === studentId);
    if (item) {
      item.paidAmount += amount;
      item.pendingAmount = Math.max(0, item.totalFee - item.paidAmount);
      item.status = item.pendingAmount === 0 ? 'Paid' : 'Partial';
      item.transactions.unshift(tx);
      writeCollection('fees', list);
      return item;
    }
    return null;
  },

  // Assignments
  getAssignments: async () => {
    if (isMongooseConnected) return AssignmentModel.find().sort({ createdAt: -1 }).lean();
    return readCollection('assignments', INITIAL_ASSIGNMENTS);
  },
  addAssignment: async (asg: any) => {
    if (isMongooseConnected) {
      const doc = new AssignmentModel(asg);
      return doc.save();
    }
    const list = readCollection('assignments', INITIAL_ASSIGNMENTS);
    list.unshift(asg);
    writeCollection('assignments', list);
    return asg;
  },

  // Submissions
  getSubmissions: async () => {
    if (isMongooseConnected) return SubmissionModel.find().sort({ createdAt: -1 }).lean();
    return readCollection('submissions', INITIAL_SUBMISSIONS);
  },
  addOrUpdateSubmission: async (sub: any) => {
    if (isMongooseConnected) {
      return SubmissionModel.findOneAndUpdate(
        { assignmentId: sub.assignmentId, studentId: sub.studentId },
        sub,
        { upsert: true, new: true }
      );
    }
    const list = readCollection('submissions', INITIAL_SUBMISSIONS);
    const idx = list.findIndex((s: any) => s.id === sub.id || (s.assignmentId === sub.assignmentId && s.studentId === sub.studentId));
    if (idx >= 0) {
      list[idx] = sub;
    } else {
      list.unshift(sub);
    }
    writeCollection('submissions', list);
    return sub;
  },

  // Materials
  getMaterials: async () => {
    if (isMongooseConnected) return MaterialModel.find().sort({ createdAt: -1 }).lean();
    return readCollection('materials', INITIAL_STUDY_MATERIALS);
  },
  addMaterial: async (mat: any) => {
    if (isMongooseConnected) {
      const doc = new MaterialModel(mat);
      return doc.save();
    }
    const list = readCollection('materials', INITIAL_STUDY_MATERIALS);
    list.unshift(mat);
    writeCollection('materials', list);
    return mat;
  },

  // Notices
  getNotices: async () => {
    if (isMongooseConnected) return NoticeModel.find().sort({ publishedDate: -1 }).lean();
    return readCollection('notices', INITIAL_NOTICES);
  },
  addNotice: async (notice: any) => {
    if (isMongooseConnected) {
      const doc = new NoticeModel(notice);
      return doc.save();
    }
    const list = readCollection('notices', INITIAL_NOTICES);
    list.unshift(notice);
    writeCollection('notices', list);
    return notice;
  },

  // Timetable
  getTimetable: async () => {
    if (isMongooseConnected) return TimetableModel.find().lean();
    return readCollection('timetable', INITIAL_TIMETABLE);
  },

  // Leaves
  getLeaves: async () => {
    if (isMongooseConnected) return LeaveModel.find().sort({ createdAt: -1 }).lean();
    return readCollection('leaves', INITIAL_LEAVES);
  },
  addLeave: async (leave: any) => {
    if (isMongooseConnected) {
      const doc = new LeaveModel(leave);
      return doc.save();
    }
    const list = readCollection('leaves', INITIAL_LEAVES);
    list.unshift(leave);
    writeCollection('leaves', list);
    return leave;
  },
  updateLeaveStatus: async (id: string, status: string, comment?: string) => {
    if (isMongooseConnected) {
      return LeaveModel.findOneAndUpdate({ id }, { status, comment }, { new: true });
    }
    const list = readCollection('leaves', INITIAL_LEAVES);
    const item = list.find((l: any) => l.id === id);
    if (item) {
      item.status = status as 'Approved' | 'Pending' | 'Rejected';
      if (comment) item.comment = comment;
      writeCollection('leaves', list);
      return item;
    }
    return null;
  },

  // Events
  getEvents: async () => {
    if (isMongooseConnected) return EventModel.find().lean();
    return readCollection('events', INITIAL_EVENTS);
  },

  // Reset database to initial seed
  resetAll: async () => {
    if (isMongooseConnected) {
      await Promise.all([
        UserModel.deleteMany({}),
        SubjectModel.deleteMany({}),
        AttendanceModel.deleteMany({}),
        MarksModel.deleteMany({}),
        FeeModel.deleteMany({}),
        AssignmentModel.deleteMany({}),
        SubmissionModel.deleteMany({}),
        MaterialModel.deleteMany({}),
        NoticeModel.deleteMany({}),
        TimetableModel.deleteMany({}),
        LeaveModel.deleteMany({}),
        EventModel.deleteMany({})
      ]);
      await UserModel.insertMany(INITIAL_USERS);
      await SubjectModel.insertMany(INITIAL_SUBJECTS);
      await AttendanceModel.insertMany(INITIAL_ATTENDANCE);
      await MarksModel.insertMany(INITIAL_MARKS);
      await FeeModel.insertMany(INITIAL_FEES);
      await AssignmentModel.insertMany(INITIAL_ASSIGNMENTS);
      await SubmissionModel.insertMany(INITIAL_SUBMISSIONS);
      await MaterialModel.insertMany(INITIAL_STUDY_MATERIALS);
      await NoticeModel.insertMany(INITIAL_NOTICES);
      await TimetableModel.insertMany(INITIAL_TIMETABLE);
      await LeaveModel.insertMany(INITIAL_LEAVES);
      await EventModel.insertMany(INITIAL_EVENTS);
    }
    writeCollection('users', INITIAL_USERS);
    writeCollection('subjects', INITIAL_SUBJECTS);
    writeCollection('attendance', INITIAL_ATTENDANCE);
    writeCollection('marks', INITIAL_MARKS);
    writeCollection('fees', INITIAL_FEES);
    writeCollection('assignments', INITIAL_ASSIGNMENTS);
    writeCollection('submissions', INITIAL_SUBMISSIONS);
    writeCollection('materials', INITIAL_STUDY_MATERIALS);
    writeCollection('notices', INITIAL_NOTICES);
    writeCollection('timetable', INITIAL_TIMETABLE);
    writeCollection('leaves', INITIAL_LEAVES);
    writeCollection('events', INITIAL_EVENTS);
  }
};
