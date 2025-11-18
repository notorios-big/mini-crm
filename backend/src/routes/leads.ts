import express from 'express';
import {
  createLead,
  updateLeadStep,
  getLeads,
  getLead,
  updateLeadStatus,
  addTagToLead,
  removeTagFromLead,
  addNote,
  getDashboardStats,
  deleteLead,
} from '../controllers/leadsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes (for landing page)
router.post('/', createLead);
router.put('/:id/step', updateLeadStep);

// Admin routes
router.get('/stats', authenticateToken, getDashboardStats);
router.get('/', authenticateToken, getLeads);
router.get('/:id', authenticateToken, getLead);
router.put('/:id/status', authenticateToken, updateLeadStatus);
router.post('/:id/tags', authenticateToken, addTagToLead);
router.delete('/:id/tags/:tagId', authenticateToken, removeTagFromLead);
router.post('/:id/notes', authenticateToken, addNote);
router.delete('/:id', authenticateToken, deleteLead);

export default router;
