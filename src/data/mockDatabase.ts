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

export const COLLEGE_INFO = {
  institution: "K.L.E. SOCIETY'S",
  name: "P.C. JABIN SCIENCE COLLEGE",
  status: "AUTONOMOUS",
  affiliation: "Affiliated to KARNATAK UNIVERSITY, DHARWAD",
  location: "Vidyanagar, Hubballi - 580031, Karnataka, India",
  naac: "NAAC Accredited 'A' Grade (4th Cycle) with CGPA 3.43",
  department: "Bachelor of Computer Application (BCA)",
  academicYear: "2026-27",
  synopsis: {
    title: "SMART COLLEGE MANAGEMENT SYSTEM",
    submittedBy: [
      { name: "Sanjana Kulkarni", rollNo: "224048", regNo: "U15JC24S0048" },
      { name: "Aishwarya Angadi", rollNo: "224002", regNo: "U15JC24S0002" },
      { name: "Shivchetan", rollNo: "224052", regNo: "U15JC24S0052" }
    ],
    guides: [
      { name: "Prof. Sampada S", designation: "Assistant Professor, Dept of BCA" },
      { name: "Prof. Akash", designation: "Assistant Professor, Dept of BCA" }
    ],
    stack: "MERN Stack (MongoDB, Express.js, React.js, Node.js)"
  }
};

export const INITIAL_USERS: User[] = [
  // Administrator
  {
    id: "usr_admin_1",
    name: "Dr. L. D. Horakeri",
    email: "principal@pcjabin.edu.in",
    role: "admin",
    phone: "+91 94481 23450",
    department: "Administration / Principal Office",
    designation: "Principal & Chief Academic Officer",
    staffId: "KLE-ADM-001"
  },
  // Guides & Faculty
  {
    id: "usr_fac_1",
    name: "Prof. Sampada S",
    email: "sampada.s@pcjabin.edu.in",
    role: "teacher",
    phone: "+91 98452 77123",
    department: "Bachelor of Computer Application (BCA)",
    designation: "Assistant Professor & Project Guide",
    qualification: "M.Tech (CSE), Ph.D (Pursuing)",
    experience: "9 Years",
    specialization: ["Full Stack Web Dev (MERN)", "Cloud Computing", "Software Engineering"],
    staffId: "KLE-BCA-104",
    cabinNo: "BCA Staff Room - 204"
  },
  {
    id: "usr_fac_2",
    name: "Prof. Akash",
    email: "akash.bca@pcjabin.edu.in",
    role: "teacher",
    phone: "+91 97410 88921",
    department: "Bachelor of Computer Application (BCA)",
    designation: "Assistant Professor & Project Co-Guide",
    qualification: "MCA, M.Phil (Computer Science)",
    experience: "7 Years",
    specialization: ["Database Management Systems", "Node.js & Express", "NoSQL / MongoDB"],
    staffId: "KLE-BCA-108",
    cabinNo: "BCA Staff Room - 205"
  },
  {
    id: "usr_fac_3",
    name: "Prof. Rajeshwari G",
    email: "rajeshwari.g@pcjabin.edu.in",
    role: "teacher",
    phone: "+91 94801 55620",
    department: "Bachelor of Computer Application (BCA)",
    designation: "Assistant Professor",
    qualification: "M.Tech (IT)",
    experience: "6 Years",
    specialization: ["Python Programming", "Data Structures", "Operating Systems"],
    staffId: "KLE-BCA-112",
    cabinNo: "BCA Staff Room - 202"
  },
  // Project Team Members & Students
  {
    id: "usr_stu_1",
    name: "Sanjana Kulkarni",
    email: "sanjanakulkarni11092006@gmail.com",
    role: "student",
    rollNo: "224048",
    regNo: "U15JC24S0048",
    department: "Bachelor of Computer Application",
    semester: 5,
    section: "A",
    admissionYear: "2024",
    phone: "+91 88612 90124",
    guardianName: "V. R. Kulkarni",
    guardianPhone: "+91 94480 33412",
    bloodGroup: "O+",
    address: "Deshpande Nagar, Hubballi - 580029"
  },
  {
    id: "usr_stu_2",
    name: "Aishwarya Angadi",
    email: "aishwarya.angadi@student.pcjabin.edu.in",
    role: "student",
    rollNo: "224002",
    regNo: "U15JC24S0002",
    department: "Bachelor of Computer Application",
    semester: 5,
    section: "A",
    admissionYear: "2024",
    phone: "+91 90081 22345",
    guardianName: "M. S. Angadi",
    guardianPhone: "+91 94481 66789",
    bloodGroup: "B+",
    address: "Shirur Park, Vidyanagar, Hubballi - 580031"
  },
  {
    id: "usr_stu_3",
    name: "Shivchetan",
    email: "shivchetan@student.pcjabin.edu.in",
    role: "student",
    rollNo: "224052",
    regNo: "U15JC24S0052",
    department: "Bachelor of Computer Application",
    semester: 5,
    section: "A",
    admissionYear: "2024",
    phone: "+91 91104 33499",
    guardianName: "S. B. Patil",
    guardianPhone: "+91 98450 11223",
    bloodGroup: "A+",
    address: "Keshwapur, Hubballi - 580023"
  },
  {
    id: "usr_stu_4",
    name: "Rahul Desai",
    email: "rahul.desai@student.pcjabin.edu.in",
    role: "student",
    rollNo: "224035",
    regNo: "U15JC24S0035",
    department: "Bachelor of Computer Application",
    semester: 5,
    section: "A",
    admissionYear: "2024",
    phone: "+91 96200 44551",
    guardianName: "A. B. Desai",
    guardianPhone: "+91 99001 22114",
    bloodGroup: "AB+",
    address: "Gokul Road, Hubballi - 580030"
  },
  {
    id: "usr_stu_5",
    name: "Sneha Patil",
    email: "sneha.patil@student.pcjabin.edu.in",
    role: "student",
    rollNo: "224042",
    regNo: "U15JC24S0042",
    department: "Bachelor of Computer Application",
    semester: 5,
    section: "A",
    admissionYear: "2024",
    phone: "+91 97390 12876",
    guardianName: "R. K. Patil",
    guardianPhone: "+91 94490 88219",
    bloodGroup: "O-",
    address: "Navanagar, Hubballi - 580025"
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "sub_501",
    code: "BCA501",
    name: "Web Technology & MERN Stack",
    semester: 5,
    credits: 4,
    facultyId: "usr_fac_1",
    facultyName: "Prof. Sampada S",
    type: "Core",
    totalHours: 52
  },
  {
    id: "sub_502",
    code: "BCA502",
    name: "Database Management & MongoDB",
    semester: 5,
    credits: 4,
    facultyId: "usr_fac_2",
    facultyName: "Prof. Akash",
    type: "Core",
    totalHours: 52
  },
  {
    id: "sub_503",
    code: "BCA503",
    name: "Cloud Computing & DevOps",
    semester: 5,
    credits: 3,
    facultyId: "usr_fac_1",
    facultyName: "Prof. Sampada S",
    type: "Elective",
    totalHours: 42
  },
  {
    id: "sub_504",
    code: "BCA504",
    name: "Software Engineering & Agile",
    semester: 5,
    credits: 3,
    facultyId: "usr_fac_2",
    facultyName: "Prof. Akash",
    type: "Core",
    totalHours: 42
  },
  {
    id: "sub_505",
    code: "BCA505",
    name: "Python Programming & Analytics",
    semester: 5,
    credits: 3,
    facultyId: "usr_fac_3",
    facultyName: "Prof. Rajeshwari G",
    type: "Core",
    totalHours: 42
  },
  {
    id: "sub_506",
    code: "BCA506L",
    name: "Web Development Lab (MERN)",
    semester: 5,
    credits: 2,
    facultyId: "usr_fac_1",
    facultyName: "Prof. Sampada S",
    type: "Practical",
    totalHours: 48
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att_001",
    date: "2026-10-12",
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    semester: 5,
    section: "A",
    teacherId: "usr_fac_1",
    records: [
      { studentId: "usr_stu_1", studentName: "Sanjana Kulkarni", rollNo: "224048", status: "present" },
      { studentId: "usr_stu_2", studentName: "Aishwarya Angadi", rollNo: "224002", status: "present" },
      { studentId: "usr_stu_3", studentName: "Shivchetan", rollNo: "224052", status: "present" },
      { studentId: "usr_stu_4", studentName: "Rahul Desai", rollNo: "224035", status: "absent" },
      { studentId: "usr_stu_5", studentName: "Sneha Patil", rollNo: "224042", status: "present" }
    ]
  },
  {
    id: "att_002",
    date: "2026-10-12",
    subjectId: "sub_502",
    subjectCode: "BCA502",
    subjectName: "Database Management & MongoDB",
    semester: 5,
    section: "A",
    teacherId: "usr_fac_2",
    records: [
      { studentId: "usr_stu_1", studentName: "Sanjana Kulkarni", rollNo: "224048", status: "present" },
      { studentId: "usr_stu_2", studentName: "Aishwarya Angadi", rollNo: "224002", status: "present" },
      { studentId: "usr_stu_3", studentName: "Shivchetan", rollNo: "224052", status: "present" },
      { studentId: "usr_stu_4", studentName: "Rahul Desai", rollNo: "224035", status: "present" },
      { studentId: "usr_stu_5", studentName: "Sneha Patil", rollNo: "224042", status: "present" }
    ]
  },
  {
    id: "att_003",
    date: "2026-10-11",
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    semester: 5,
    section: "A",
    teacherId: "usr_fac_1",
    records: [
      { studentId: "usr_stu_1", studentName: "Sanjana Kulkarni", rollNo: "224048", status: "present" },
      { studentId: "usr_stu_2", studentName: "Aishwarya Angadi", rollNo: "224002", status: "present" },
      { studentId: "usr_stu_3", studentName: "Shivchetan", rollNo: "224052", status: "present" },
      { studentId: "usr_stu_4", studentName: "Rahul Desai", rollNo: "224035", status: "absent" },
      { studentId: "usr_stu_5", studentName: "Sneha Patil", rollNo: "224042", status: "late" }
    ]
  },
  {
    id: "att_004",
    date: "2026-10-10",
    subjectId: "sub_505",
    subjectCode: "BCA505",
    subjectName: "Python Programming & Analytics",
    semester: 5,
    section: "A",
    teacherId: "usr_fac_3",
    records: [
      { studentId: "usr_stu_1", studentName: "Sanjana Kulkarni", rollNo: "224048", status: "present" },
      { studentId: "usr_stu_2", studentName: "Aishwarya Angadi", rollNo: "224002", status: "present" },
      { studentId: "usr_stu_3", studentName: "Shivchetan", rollNo: "224052", status: "present" },
      { studentId: "usr_stu_4", studentName: "Rahul Desai", rollNo: "224035", status: "present" },
      { studentId: "usr_stu_5", studentName: "Sneha Patil", rollNo: "224042", status: "absent" }
    ]
  },
  {
    id: "att_005",
    date: "2026-10-09",
    subjectId: "sub_506",
    subjectCode: "BCA506L",
    subjectName: "Web Development Lab (MERN)",
    semester: 5,
    section: "A",
    teacherId: "usr_fac_1",
    records: [
      { studentId: "usr_stu_1", studentName: "Sanjana Kulkarni", rollNo: "224048", status: "present" },
      { studentId: "usr_stu_2", studentName: "Aishwarya Angadi", rollNo: "224002", status: "present" },
      { studentId: "usr_stu_3", studentName: "Shivchetan", rollNo: "224052", status: "present" },
      { studentId: "usr_stu_4", studentName: "Rahul Desai", rollNo: "224035", status: "present" },
      { studentId: "usr_stu_5", studentName: "Sneha Patil", rollNo: "224042", status: "present" }
    ]
  }
];

export const INITIAL_MARKS: MarksRecord[] = [
  // Sanjana Kulkarni
  {
    id: "mrk_101",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    ia1: 19,
    ia2: 19,
    assignment: 10,
    see: 46,
    total: 94,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },
  {
    id: "mrk_102",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    subjectId: "sub_502",
    subjectCode: "BCA502",
    subjectName: "Database Management & MongoDB",
    ia1: 18,
    ia2: 19,
    assignment: 10,
    see: 45,
    total: 92,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },
  {
    id: "mrk_103",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    subjectId: "sub_503",
    subjectCode: "BCA503",
    subjectName: "Cloud Computing & DevOps",
    ia1: 17,
    ia2: 18,
    assignment: 9,
    see: 44,
    total: 88,
    grade: "A+",
    gradePoint: 9,
    status: "Pass"
  },
  {
    id: "mrk_104",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    subjectId: "sub_505",
    subjectCode: "BCA505",
    subjectName: "Python Programming & Analytics",
    ia1: 18,
    ia2: 19,
    assignment: 10,
    see: 47,
    total: 94,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },
  {
    id: "mrk_105",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    subjectId: "sub_506",
    subjectCode: "BCA506L",
    subjectName: "Web Development Lab (MERN)",
    ia1: 20,
    ia2: 20,
    assignment: 10,
    see: 48,
    total: 98,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },

  // Aishwarya Angadi
  {
    id: "mrk_201",
    studentId: "usr_stu_2",
    studentName: "Aishwarya Angadi",
    rollNo: "224002",
    semester: 5,
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    ia1: 18,
    ia2: 19,
    assignment: 10,
    see: 45,
    total: 92,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },
  {
    id: "mrk_202",
    studentId: "usr_stu_2",
    studentName: "Aishwarya Angadi",
    rollNo: "224002",
    semester: 5,
    subjectId: "sub_502",
    subjectCode: "BCA502",
    subjectName: "Database Management & MongoDB",
    ia1: 19,
    ia2: 18,
    assignment: 9,
    see: 44,
    total: 90,
    grade: "O",
    gradePoint: 10,
    status: "Pass"
  },

  // Shivchetan
  {
    id: "mrk_301",
    studentId: "usr_stu_3",
    studentName: "Shivchetan",
    rollNo: "224052",
    semester: 5,
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    ia1: 18,
    ia2: 18,
    assignment: 9,
    see: 43,
    total: 88,
    grade: "A+",
    gradePoint: 9,
    status: "Pass"
  },
  {
    id: "mrk_302",
    studentId: "usr_stu_3",
    studentName: "Shivchetan",
    rollNo: "224052",
    semester: 5,
    subjectId: "sub_502",
    subjectCode: "BCA502",
    subjectName: "Database Management & MongoDB",
    ia1: 17,
    ia2: 18,
    assignment: 10,
    see: 44,
    total: 89,
    grade: "A+",
    gradePoint: 9,
    status: "Pass"
  },

  // Rahul Desai
  {
    id: "mrk_401",
    studentId: "usr_stu_4",
    studentName: "Rahul Desai",
    rollNo: "224035",
    semester: 5,
    subjectId: "sub_501",
    subjectCode: "BCA501",
    subjectName: "Web Technology & MERN Stack",
    ia1: 14,
    ia2: 13,
    assignment: 8,
    see: 35,
    total: 70,
    grade: "B+",
    gradePoint: 7,
    status: "Pass"
  }
];

export const INITIAL_FEES: FeeItem[] = [
  {
    id: "fee_001",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    semester: 5,
    academicYear: "2026-27",
    totalFee: 42500,
    paidAmount: 42500,
    pendingAmount: 0,
    dueDate: "2026-11-15",
    status: "Paid",
    breakdown: {
      tuitionFee: 26000,
      labFee: 8500,
      libraryFee: 2500,
      examFee: 3500,
      sportsCulturalFee: 2000
    },
    transactions: [
      {
        id: "tx_01",
        amount: 25000,
        date: "2026-08-10",
        paymentMode: "Online",
        transactionRef: "KLEPAY240801290",
        receiptNo: "REC-2026-BCA-0048A"
      },
      {
        id: "tx_02",
        amount: 17500,
        date: "2026-09-22",
        paymentMode: "UPI",
        transactionRef: "UPI9932145561",
        receiptNo: "REC-2026-BCA-0048B"
      }
    ]
  },
  {
    id: "fee_002",
    studentId: "usr_stu_2",
    studentName: "Aishwarya Angadi",
    rollNo: "224002",
    semester: 5,
    academicYear: "2026-27",
    totalFee: 42500,
    paidAmount: 30000,
    pendingAmount: 12500,
    dueDate: "2026-11-15",
    status: "Partial",
    breakdown: {
      tuitionFee: 26000,
      labFee: 8500,
      libraryFee: 2500,
      examFee: 3500,
      sportsCulturalFee: 2000
    },
    transactions: [
      {
        id: "tx_03",
        amount: 30000,
        date: "2026-08-15",
        paymentMode: "NetBanking",
        transactionRef: "HDFC98421477",
        receiptNo: "REC-2026-BCA-0002A"
      }
    ]
  },
  {
    id: "fee_003",
    studentId: "usr_stu_3",
    studentName: "Shivchetan",
    rollNo: "224052",
    semester: 5,
    academicYear: "2026-27",
    totalFee: 42500,
    paidAmount: 42500,
    pendingAmount: 0,
    dueDate: "2026-11-15",
    status: "Paid",
    breakdown: {
      tuitionFee: 26000,
      labFee: 8500,
      libraryFee: 2500,
      examFee: 3500,
      sportsCulturalFee: 2000
    },
    transactions: [
      {
        id: "tx_04",
        amount: 42500,
        date: "2026-08-12",
        paymentMode: "Online",
        transactionRef: "KLEPAY240801994",
        receiptNo: "REC-2026-BCA-0052A"
      }
    ]
  },
  {
    id: "fee_004",
    studentId: "usr_stu_4",
    studentName: "Rahul Desai",
    rollNo: "224035",
    semester: 5,
    academicYear: "2026-27",
    totalFee: 42500,
    paidAmount: 15000,
    pendingAmount: 27500,
    dueDate: "2026-10-25",
    status: "Partial",
    breakdown: {
      tuitionFee: 26000,
      labFee: 8500,
      libraryFee: 2500,
      examFee: 3500,
      sportsCulturalFee: 2000
    },
    transactions: [
      {
        id: "tx_05",
        amount: 15000,
        date: "2026-08-20",
        paymentMode: "Challan",
        transactionRef: "SYND990142",
        receiptNo: "REC-2026-BCA-0035A"
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg_001",
    title: "MERN Stack REST API with Express and Mongoose",
    description: "Design and implement full CRUD REST endpoints for College Management modules: Students, Faculty, and Attendance with JWT authentication middleware and schema validation.",
    subjectId: "sub_501",
    subjectName: "Web Technology & MERN Stack",
    semester: 5,
    facultyId: "usr_fac_1",
    facultyName: "Prof. Sampada S",
    assignedDate: "2026-10-05",
    dueDate: "2026-10-20",
    maxMarks: 10,
    fileAttachment: "MERN_API_Lab_Manual.pdf",
    submissionsCount: 4
  },
  {
    id: "asg_002",
    title: "MongoDB Schema Design & Aggregation Pipelines",
    description: "Formulate complex MongoDB aggregation queries to calculate student attendance percentage, semester GPA, and department-wise fee dues from sample collections.",
    subjectId: "sub_502",
    subjectName: "Database Management & MongoDB",
    semester: 5,
    facultyId: "usr_fac_2",
    facultyName: "Prof. Akash",
    assignedDate: "2026-10-08",
    dueDate: "2026-10-25",
    maxMarks: 10,
    fileAttachment: "NoSQL_Aggregation_Guide.pdf",
    submissionsCount: 3
  },
  {
    id: "asg_003",
    title: "AWS / Google Cloud Run Containerized Deployment",
    description: "Containerize the Node.js/React frontend application using Dockerfile and document CI/CD pipeline steps for cloud hosting with HTTPS & environment variables.",
    subjectId: "sub_503",
    subjectName: "Cloud Computing & DevOps",
    semester: 5,
    facultyId: "usr_fac_1",
    facultyName: "Prof. Sampada S",
    assignedDate: "2026-10-10",
    dueDate: "2026-10-28",
    maxMarks: 10,
    fileAttachment: "Cloud_DevOps_Assignment_Spec.pdf",
    submissionsCount: 2
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: "subm_001",
    assignmentId: "asg_001",
    studentId: "usr_stu_1",
    studentName: "Sanjana Kulkarni",
    rollNo: "224048",
    submittedAt: "2026-10-12 14:30",
    submissionContent: "Implemented complete Express routes with modular routers, MongoDB schemas with Mongoose timestamps, and role-based auth middleware. GitHub repo: https://github.com/sanjana-k/smart-college-mern",
    fileName: "Sanjana_224048_MERN_REST_API.zip",
    status: "Graded",
    marksObtained: 10,
    feedback: "Outstanding work! Clean route segregation and robust error-handling middleware."
  },
  {
    id: "subm_002",
    assignmentId: "asg_001",
    studentId: "usr_stu_2",
    studentName: "Aishwarya Angadi",
    rollNo: "224002",
    submittedAt: "2026-10-12 16:15",
    submissionContent: "Created JWT token generation with bcrypt password hashing and 12 unit test cases for student & attendance endpoints.",
    fileName: "Aishwarya_224002_MERN_Assignment1.zip",
    status: "Graded",
    marksObtained: 9.5,
    feedback: "Very neat documentation and postman collection included."
  },
  {
    id: "subm_003",
    assignmentId: "asg_001",
    studentId: "usr_stu_3",
    studentName: "Shivchetan",
    rollNo: "224052",
    submittedAt: "2026-10-13 11:20",
    submissionContent: "Full implementation of MERN REST backend with CORS protection, environment configuration and MongoDB atlas cluster connection.",
    fileName: "Shivchetan_224052_MERN_API.zip",
    status: "Graded",
    marksObtained: 9.5,
    feedback: "Great job! Schema indexes are properly configured."
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: "mat_001",
    title: "Unit 3: Express.js Architecture, Routers & Middleware",
    description: "Comprehensive handwritten and digital notes covering Express request-response lifecycle, error middleware, and CORS security.",
    subjectId: "sub_501",
    subjectName: "Web Technology & MERN Stack",
    semester: 5,
    uploadedBy: "Prof. Sampada S",
    uploadDate: "2026-10-02",
    fileType: "pdf",
    fileSize: "4.2 MB",
    downloads: 142
  },
  {
    id: "mat_002",
    title: "BCA 5th Sem Complete Autonomous Syllabus (2026-27)",
    description: "Official Autonomous regulation syllabus copy with course outcomes, textbooks, and laboratory blueprints approved by Academic Council.",
    subjectId: "sub_501",
    subjectName: "BCA Department Curriculum",
    semester: 5,
    uploadedBy: "Prof. Sampada S",
    uploadDate: "2026-08-01",
    fileType: "pdf",
    fileSize: "1.8 MB",
    downloads: 285
  },
  {
    id: "mat_003",
    title: "MongoDB Aggregation Pipeline Cheatsheet & Indexing Best Practices",
    description: "Practical guide to $match, $group, $lookup, $unwind and performance profiling with explain().",
    subjectId: "sub_502",
    subjectName: "Database Management & MongoDB",
    semester: 5,
    uploadedBy: "Prof. Akash",
    uploadDate: "2026-09-18",
    fileType: "pdf",
    fileSize: "3.1 MB",
    downloads: 119
  },
  {
    id: "mat_004",
    title: "Web Tech Lab Manual with 14 Practical Programs",
    description: "Step-by-step problem statements, source code, input/output screenshots, and viva questions for BCA506L.",
    subjectId: "sub_506",
    subjectName: "Web Development Lab (MERN)",
    semester: 5,
    uploadedBy: "Prof. Sampada S",
    uploadDate: "2026-08-15",
    fileType: "pdf",
    fileSize: "5.6 MB",
    downloads: 230
  },
  {
    id: "mat_005",
    title: "Previous 3 Years Autonomous Question Papers with Solution Hints",
    description: "Semester End Exam (SEE) question papers from 2023, 2024, and 2025 examinations with marking schemes.",
    subjectId: "sub_501",
    subjectName: "Autonomous Exam Question Bank",
    semester: 5,
    uploadedBy: "Prof. Akash",
    uploadDate: "2026-09-25",
    fileType: "zip",
    fileSize: "8.4 MB",
    downloads: 198
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "not_001",
    title: "Schedule for Internal Assessment-II (IA-2) - November 2026",
    content: "All BCA V Semester students are hereby informed that the second Internal Assessment (IA-2) will commence from November 10, 2026. Hall tickets will be issued only to candidates having minimum 75% attendance.",
    category: "Examination",
    targetRole: "all",
    publishedDate: "2026-10-12",
    authorName: "Controller of Examinations (Autonomous)",
    isUrgent: true
  },
  {
    id: "not_002",
    title: "Annual Tech Fest 'JabinIT 2026' - Registrations Open",
    content: "Department of BCA is hosting its State-Level Technical Symposium 'JabinIT 2026' on November 28 & 29. Events include Web Hackathon, Code Debugging, IT Quiz, Gaming, and Web Design. Exciting cash prizes worth ₹50,000!",
    category: "Event",
    targetRole: "all",
    publishedDate: "2026-10-10",
    authorName: "Prof. Sampada S (Faculty Convener)"
  },
  {
    id: "not_003",
    title: "Campus Recruitment Drive - Infosys & TCS for BCA Final Year",
    content: "Infosys and TCS campus recruitment drive pre-placement talks are scheduled on October 29 at Sir C.V. Raman Auditorium. Eligible students (min 60% aggregate without standing backlogs) must register before Oct 24.",
    category: "Placement",
    targetRole: "students",
    publishedDate: "2026-10-08",
    authorName: "Training & Placement Cell"
  },
  {
    id: "not_004",
    title: "Faculty Board of Studies (BOS) Meeting for Autonomous Curriculum Review",
    content: "Meeting of the Board of Studies in Computer Science & Applications is scheduled for Saturday at 11:00 AM in the Conference Hall. All faculty members are requested to attend with course feedback files.",
    category: "Academic",
    targetRole: "teachers",
    publishedDate: "2026-10-07",
    authorName: "Dean of Academics"
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: "tt_01", day: "Monday", time: "09:00 - 10:00", subjectCode: "BCA501", subjectName: "Web Technology & MERN", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_02", day: "Monday", time: "10:00 - 11:00", subjectCode: "BCA502", subjectName: "Database Management & MongoDB", facultyName: "Prof. Akash", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_03", day: "Monday", time: "11:15 - 12:15", subjectCode: "BCA505", subjectName: "Python Programming", facultyName: "Prof. Rajeshwari G", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_04", day: "Monday", time: "01:00 - 04:00", subjectCode: "BCA506L", subjectName: "Web Development Lab (MERN)", facultyName: "Prof. Sampada S", room: "Computer Lab 3", semester: 5, type: "Lab" },

  // Tuesday
  { id: "tt_05", day: "Tuesday", time: "09:00 - 10:00", subjectCode: "BCA502", subjectName: "Database Management & MongoDB", facultyName: "Prof. Akash", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_06", day: "Tuesday", time: "10:00 - 11:00", subjectCode: "BCA501", subjectName: "Web Technology & MERN", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_07", day: "Tuesday", time: "11:15 - 12:15", subjectCode: "BCA503", subjectName: "Cloud Computing & DevOps", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_08", day: "Tuesday", time: "12:15 - 01:15", subjectCode: "BCA504", subjectName: "Software Engineering & Agile", facultyName: "Prof. Akash", room: "Room 204", semester: 5, type: "Theory" },

  // Wednesday
  { id: "tt_09", day: "Wednesday", time: "09:00 - 10:00", subjectCode: "BCA505", subjectName: "Python Programming", facultyName: "Prof. Rajeshwari G", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_10", day: "Wednesday", time: "10:00 - 11:00", subjectCode: "BCA503", subjectName: "Cloud Computing & DevOps", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_11", day: "Wednesday", time: "11:15 - 01:15", subjectCode: "BCA502L", subjectName: "Database & MongoDB Lab", facultyName: "Prof. Akash", room: "Computer Lab 2", semester: 5, type: "Lab" },

  // Thursday
  { id: "tt_12", day: "Thursday", time: "09:00 - 10:00", subjectCode: "BCA501", subjectName: "Web Technology & MERN", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_13", day: "Thursday", time: "10:00 - 11:00", subjectCode: "BCA504", subjectName: "Software Engineering & Agile", facultyName: "Prof. Akash", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_14", day: "Thursday", time: "11:15 - 12:15", subjectCode: "BCA502", subjectName: "Database Management & MongoDB", facultyName: "Prof. Akash", room: "Room 204", semester: 5, type: "Theory" },

  // Friday
  { id: "tt_15", day: "Friday", time: "09:00 - 10:00", subjectCode: "BCA503", subjectName: "Cloud Computing & DevOps", facultyName: "Prof. Sampada S", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_16", day: "Friday", time: "10:00 - 11:00", subjectCode: "BCA505", subjectName: "Python Programming", facultyName: "Prof. Rajeshwari G", room: "Room 204", semester: 5, type: "Theory" },
  { id: "tt_17", day: "Friday", time: "11:15 - 01:15", subjectCode: "PROJ-501", subjectName: "Major Project Synopsis & Lab", facultyName: "Prof. Sampada S & Prof. Akash", room: "Project Lab", semester: 5, type: "Lab" },

  // Saturday
  { id: "tt_18", day: "Saturday", time: "08:30 - 10:30", subjectCode: "SEMINAR", subjectName: "Technical Seminar & Presentations", facultyName: "BCA Faculty Panel", room: "Seminar Hall", semester: 5, type: "Theory" },
  { id: "tt_19", day: "Saturday", time: "10:45 - 12:30", subjectCode: "MENTOR", subjectName: "Mentorship & Remedial Classes", facultyName: "Faculty Mentors", room: "Room 204", semester: 5, type: "Theory" }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: "lv_001",
    userId: "usr_stu_1",
    userName: "Sanjana Kulkarni",
    userRole: "student",
    rollOrStaffId: "224048",
    leaveType: "Academic Event",
    startDate: "2026-10-18",
    endDate: "2026-10-19",
    reason: "Representing P.C. Jabin Science College at Inter-Collegiate State Level Hackathon hosted by Karnatak University, Dharwad.",
    status: "Approved",
    appliedOn: "2026-10-10",
    comment: "Sanctioned on duty. Best wishes for the competition!"
  },
  {
    id: "lv_002",
    userId: "usr_stu_4",
    userName: "Rahul Desai",
    userRole: "student",
    rollOrStaffId: "224035",
    leaveType: "Medical",
    startDate: "2026-10-14",
    endDate: "2026-10-15",
    reason: "Suffering from acute viral fever. Doctor advised 2 days bed rest. Medical certificate attached.",
    status: "Pending",
    appliedOn: "2026-10-13"
  }
];

export const INITIAL_EVENTS: CollegeEvent[] = [
  {
    id: "evt_001",
    title: "JabinIT 2026 - State-Level IT Fest",
    description: "Annual flag-bearer technical symposium featuring full stack web hackathon, algorithmic coding challenge, tech debate and gaming arena.",
    date: "2026-11-28",
    time: "09:30 AM - 05:30 PM",
    venue: "Sir C.V. Raman Auditorium & BCA Labs",
    category: "Technical",
    organizer: "BCA Association & Students Council"
  },
  {
    id: "evt_002",
    title: "Workshop on MERN Stack & Cloud Deployment",
    description: "Hands-on industrial expert masterclass covering React 19, Node.js microservices, Dockerization and Cloud hosting.",
    date: "2026-10-24",
    time: "10:00 AM - 04:00 PM",
    venue: "Seminar Hall 1",
    category: "Seminar",
    organizer: "Prof. Sampada S & Prof. Akash"
  },
  {
    id: "evt_003",
    title: "Autonomous End-Semester Examination Commences",
    description: "Theory examinations for BCA Semesters I, III, and V as per Karnatak University affiliated Autonomous calendar of events.",
    date: "2026-12-05",
    time: "02:00 PM - 05:00 PM",
    venue: "Main Examination Block",
    category: "Examination",
    organizer: "Controller of Examinations"
  }
];
