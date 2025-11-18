import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../config/database';
import { Tag } from '../models/types';
import { AuthRequest } from '../middleware/auth';

// Get all tags (admin)
export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await allQuery<Tag>('SELECT * FROM tags ORDER BY name', []);
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Error al obtener etiquetas' });
  }
};

// Create tag (admin)
export const createTag = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Nombre y color son requeridos' });
    }

    // Check if tag already exists
    const existingTag = await getQuery<Tag>('SELECT * FROM tags WHERE name = ?', [name]);

    if (existingTag) {
      return res.status(400).json({ error: 'La etiqueta ya existe' });
    }

    await runQuery('INSERT INTO tags (name, color) VALUES (?, ?)', [name, color]);

    const tag = await getQuery<Tag>('SELECT * FROM tags WHERE name = ?', [name]);

    res.json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Error al crear etiqueta' });
  }
};

// Update tag (admin)
export const updateTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({ error: 'Nombre y color son requeridos' });
    }

    await runQuery('UPDATE tags SET name = ?, color = ? WHERE id = ?', [name, color, id]);

    res.json({ message: 'Etiqueta actualizada' });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Error al actualizar etiqueta' });
  }
};

// Delete tag (admin)
export const deleteTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await runQuery('DELETE FROM tags WHERE id = ?', [id]);

    res.json({ message: 'Etiqueta eliminada' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Error al eliminar etiqueta' });
  }
};
