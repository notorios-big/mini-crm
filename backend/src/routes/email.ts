import express from 'express';
import {
  getEmailSequences,
  getEmailSequence,
  createEmailSequence,
  updateEmailSequence,
  deleteEmailSequence,
  getEmailLogs,
  getAllEmailLogs,
} from '../controllers/emailController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.get('/sequences', authenticateToken, getEmailSequences);
router.get('/sequences/:id', authenticateToken, getEmailSequence);
router.post('/sequences', authenticateToken, createEmailSequence);
router.put('/sequences/:id', authenticateToken, updateEmailSequence);
router.delete('/sequences/:id', authenticateToken, deleteEmailSequence);

router.get('/logs', authenticateToken, getAllEmailLogs);
router.get('/logs/lead/:leadId', authenticateToken, getEmailLogs);

export default router;
