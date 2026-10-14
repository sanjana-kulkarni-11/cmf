import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase, MongoService } from './src/server/database';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());

  // Initialize Database
  await initDatabase();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: MongoService.getIsConnected() ? 'MongoDB Atlas / Server' : 'MongoDB Document Storage (Active)',
      institution: "K.L.E. Society's P.C. Jabin Science College Autonomous",
      department: "Bachelor of Computer Application (BCA)",
      academicYear: "2026-27"
    });
  });

  // Authentication (Register & Login)
  app.post('/api/auth/register', async (req, res) => {
    try {
      const user = await MongoService.registerUser(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful! Credentials stored in MongoDB.',
        user
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { emailOrId, password } = req.body;
      const user = await MongoService.loginUser(emailOrId, password);
      res.json({
        success: true,
        message: 'Login successful',
        user
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Authentication failed' });
    }
  });

  // Users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await MongoService.getUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const user = await MongoService.addUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Subjects
  app.get('/api/subjects', async (req, res) => {
    try {
      const subjects = await MongoService.getSubjects();
      res.json(subjects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Attendance
  app.get('/api/attendance', async (req, res) => {
    try {
      const records = await MongoService.getAttendance();
      res.json(records);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/attendance', async (req, res) => {
    try {
      const record = await MongoService.addAttendance(req.body);
      res.status(201).json(record);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Marks
  app.get('/api/marks', async (req, res) => {
    try {
      const marks = await MongoService.getMarks();
      res.json(marks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/marks', async (req, res) => {
    try {
      const updated = await MongoService.updateMarks(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Fees
  app.get('/api/fees', async (req, res) => {
    try {
      const fees = await MongoService.getFees();
      res.json(fees);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/fees/pay', async (req, res) => {
    const { studentId, amount, mode, ref } = req.body;
    try {
      const result = await MongoService.payFee(studentId, amount, mode, ref);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Assignments
  app.get('/api/assignments', async (req, res) => {
    try {
      const list = await MongoService.getAssignments();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/assignments', async (req, res) => {
    try {
      const asg = await MongoService.addAssignment(req.body);
      res.status(201).json(asg);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submissions
  app.get('/api/submissions', async (req, res) => {
    try {
      const list = await MongoService.getSubmissions();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/submissions', async (req, res) => {
    try {
      const sub = await MongoService.addOrUpdateSubmission(req.body);
      res.json(sub);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Study Materials
  app.get('/api/materials', async (req, res) => {
    try {
      const list = await MongoService.getMaterials();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/materials', async (req, res) => {
    try {
      const mat = await MongoService.addMaterial(req.body);
      res.status(201).json(mat);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Notices
  app.get('/api/notices', async (req, res) => {
    try {
      const list = await MongoService.getNotices();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/notices', async (req, res) => {
    try {
      const notice = await MongoService.addNotice(req.body);
      res.status(201).json(notice);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Timetable
  app.get('/api/timetable', async (req, res) => {
    try {
      const list = await MongoService.getTimetable();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Leaves
  app.get('/api/leaves', async (req, res) => {
    try {
      const list = await MongoService.getLeaves();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/leaves', async (req, res) => {
    try {
      const leave = await MongoService.addLeave(req.body);
      res.status(201).json(leave);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/leaves/:id', async (req, res) => {
    const { status, comment } = req.body;
    try {
      const result = await MongoService.updateLeaveStatus(req.params.id, status, comment);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Events
  app.get('/api/events', async (req, res) => {
    try {
      const list = await MongoService.getEvents();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset Data
  app.post('/api/reset', async (req, res) => {
    try {
      await MongoService.resetAll();
      res.json({ message: 'Database successfully reset to 2026-27 seed state' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
