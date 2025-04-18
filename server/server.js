import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Sequelize, DataTypes } from 'sequelize';
import { check, validationResult } from 'express-validator';
import cloudinary from '../config/cloudinaryConfig.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import bodyParser from 'body-parser';

// Setup Express
const app = express();
app.use(cors());
app.use(bodyParser.json());  // Parses incoming JSON requests

// Sequelize initialization
const sequelize = new Sequelize('election_db', 'root', '', {
  host: '127.0.0.1',
  port: 3307,
  dialect: 'mysql',
  logging: false,
});

// Models for Election and Candidate
const Election = sequelize.define('Election', {
  title: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
}, {
  tableName: 'elections',
  timestamps: true,
  paranoid: true
});

const Candidate = sequelize.define('Candidate', {
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { len: [1, 255] }
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: { isUrl: true }
  },
  saying: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: { len: [0, 500] }
  },
  election_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'elections',
      key: 'id'
    }
  }
}, {
  tableName: 'candidates',
  timestamps: true,
  paranoid: true
});

// Associations
Candidate.belongsTo(Election, { foreignKey: 'election_id' });
Election.hasMany(Candidate, { foreignKey: 'election_id' });

// Routes

// ✅ Create a new election
app.post('/api/elections', async (req, res) => {
  const { title, position, description, start_time, end_time } = req.body;
  try {
    const election = await Election.create({ title, position, description, start_time, end_time });
    res.status(200).json({ message: 'Election saved successfully', id: election.id });
  } catch (err) {
    console.error('Error saving election:', err);
    res.status(500).send('Error saving election');
  }
});

// ✅ Get all elections
app.get('/api/elections', async (req, res) => {
  try {
    const elections = await Election.findAll({ order: [['start_time', 'DESC']] });
    res.status(200).json(elections);
  } catch (err) {
    console.error('Error fetching elections:', err);
    res.status(500).send('Error fetching elections');
  }
});

// ✅ Get all candidates (with election info)
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      include: [{
        model: Election,
        attributes: ['id', 'title', 'position']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching all candidates:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Get candidates for an election
app.get('/api/elections/:electionId/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      where: { election_id: req.params.electionId },
      include: [{ model: Election, attributes: ['title', 'position'] }]
    });
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching election candidates:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// ✅ Create a candidate
app.post('/api/elections/:electionId/candidates', upload.single('photo'), async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.electionId);
    if (!election) return res.status(404).json({ message: 'Election not found' });

    let photoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'candidates',
        public_id: uuidv4(),
      });

      photoUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Clean up temp file
    }

    const candidate = await Candidate.create({
      election_id: req.params.electionId,
      fullName: req.body.fullName,
      photo: photoUrl,
      saying: req.body.saying || null,
    });

    res.status(201).json(candidate);
  } catch (err) {
    console.error('Error creating candidate:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Update candidate
app.put('/api/candidates/:id', [
  check('fullName', 'Full name is required').not().isEmpty().trim(),
  check('photo', 'Photo URL must be valid').optional().isURL(),
  check('saying', 'Saying must be less than 500 characters').optional().isLength({ max: 500 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    await candidate.update({
      fullName: req.body.fullName,
      photo: req.body.photo || null,
      saying: req.body.saying || null
    });

    res.json(candidate);
  } catch (err) {
    console.error('Error updating candidate:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Delete candidate
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    await candidate.destroy();
    res.json({ message: 'Candidate removed successfully' });
  } catch (err) {
    console.error('Error deleting candidate:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Sync DB & start server
sequelize.sync({ alter: true }).then(() => {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to sync DB:', err);
});
