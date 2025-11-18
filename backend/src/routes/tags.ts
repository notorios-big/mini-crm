import express from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.get('/', authenticateToken, getTags);
router.post('/', authenticateToken, createTag);
router.put('/:id', authenticateToken, updateTag);
router.delete('/:id', authenticateToken, deleteTag);

export default router;
