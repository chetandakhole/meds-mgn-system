import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(join(__dirname, 'medication.db'));

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Medications table
  db.run(`CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency INTEGER NOT NULL,
    instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Medication logs table
  db.run(`CREATE TABLE IF NOT EXISTS medication_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medication_id INTEGER NOT NULL,
    taken_date DATE NOT NULL,
    taken_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (medication_id) REFERENCES medications (id),
    UNIQUE(medication_id, taken_date)
  )`);
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'patient' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const token = jwt.sign(
          { id: this.lastID, email, name, role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          token,
          user: { id: this.lastID, email, name, role }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.name, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Medication routes
app.get('/api/medications', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, medications) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch medications' });
      }
      res.json(medications);
    }
  );
});

app.post('/api/medications', authenticateToken, (req, res) => {
  const { name, dosage, frequency, instructions } = req.body;

  if (!name || !dosage || !frequency) {
    return res.status(400).json({ error: 'Name, dosage, and frequency are required' });
  }

  db.run(
    'INSERT INTO medications (user_id, name, dosage, frequency, instructions) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, name, dosage, frequency, instructions || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create medication' });
      }

      db.get(
        'SELECT * FROM medications WHERE id = ?',
        [this.lastID],
        (err, medication) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch created medication' });
          }
          res.status(201).json(medication);
        }
      );
    }
  );
});

app.delete('/api/medications/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM medications WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete medication' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      res.json({ message: 'Medication deleted successfully' });
    }
  );
});

// Medication logs routes
app.get('/api/medications/:id/logs', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT ml.* FROM medication_logs ml 
     JOIN medications m ON ml.medication_id = m.id 
     WHERE m.id = ? AND m.user_id = ? 
     ORDER BY ml.taken_date DESC`,
    [id, req.user.id],
    (err, logs) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch logs' });
      }
      res.json(logs);
    }
  );
});

app.post('/api/medications/:id/logs', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { taken_date, notes } = req.body;

  if (!taken_date) {
    return res.status(400).json({ error: 'Taken date is required' });
  }

  // Verify medication belongs to user
  db.get(
    'SELECT * FROM medications WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    (err, medication) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!medication) {
        return res.status(404).json({ error: 'Medication not found' });
      }

      db.run(
        'INSERT OR REPLACE INTO medication_logs (medication_id, taken_date, notes) VALUES (?, ?, ?)',
        [id, taken_date, notes || ''],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to log medication' });
          }

          db.get(
            'SELECT * FROM medication_logs WHERE id = ?',
            [this.lastID],
            (err, log) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to fetch created log' });
              }
              res.status(201).json(log);
            }
          );
        }
      );
    }
  );
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Get total medications
  db.get(
    'SELECT COUNT(*) as total FROM medications WHERE user_id = ?',
    [userId],
    (err, totalResult) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      // Get today's logs
      const today = new Date().toISOString().split('T')[0];
      db.get(
        `SELECT COUNT(*) as taken_today FROM medication_logs ml 
         JOIN medications m ON ml.medication_id = m.id 
         WHERE m.user_id = ? AND ml.taken_date = ?`,
        [userId, today],
        (err, todayResult) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch today stats' });
          }

          // Calculate adherence for last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

          db.get(
            `SELECT 
               COUNT(DISTINCT ml.medication_id || ml.taken_date) as taken_count,
               COUNT(DISTINCT m.id) * 30 as expected_count
             FROM medications m 
             LEFT JOIN medication_logs ml ON m.id = ml.medication_id 
               AND ml.taken_date >= ? 
             WHERE m.user_id = ?`,
            [thirtyDaysAgoStr, userId],
            (err, adherenceResult) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to fetch adherence stats' });
              }

              const adherenceRate = adherenceResult.expected_count > 0 
                ? Math.round((adherenceResult.taken_count / adherenceResult.expected_count) * 100)
                : 0;

              res.json({
                totalMedications: totalResult.total,
                takenToday: todayResult.taken_today,
                adherenceRate: adherenceRate,
                streak: 0 // Simplified for now
              });
            }
          );
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});