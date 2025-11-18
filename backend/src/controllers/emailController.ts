import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../config/database';
import { EmailSequence, EmailLog } from '../models/types';
import { AuthRequest } from '../middleware/auth';

// Get all email sequences (admin)
export const getEmailSequences = async (req: AuthRequest, res: Response) => {
  try {
    const sequences = await allQuery<EmailSequence>(
      'SELECT * FROM email_sequences ORDER BY order_index',
      []
    );
    res.json(sequences);
  } catch (error) {
    console.error('Get email sequences error:', error);
    res.status(500).json({ error: 'Error al obtener secuencias' });
  }
};

// Get single email sequence (admin)
export const getEmailSequence = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const sequence = await getQuery<EmailSequence>('SELECT * FROM email_sequences WHERE id = ?', [id]);

    if (!sequence) {
      return res.status(404).json({ error: 'Secuencia no encontrada' });
    }

    res.json(sequence);
  } catch (error) {
    console.error('Get email sequence error:', error);
    res.status(500).json({ error: 'Error al obtener secuencia' });
  }
};

// Create email sequence (admin)
export const createEmailSequence = async (req: AuthRequest, res: Response) => {
  try {
    const { name, subject, body, delay_days, delay_hours, is_active, order_index } = req.body;

    if (!name || !subject || !body) {
      return res.status(400).json({ error: 'Nombre, asunto y cuerpo son requeridos' });
    }

    await runQuery(
      'INSERT INTO email_sequences (name, subject, body, delay_days, delay_hours, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, subject, body, delay_days || 0, delay_hours || 0, is_active ? 1 : 0, order_index || 0]
    );

    const sequence = await getQuery<EmailSequence>(
      'SELECT * FROM email_sequences WHERE name = ? ORDER BY id DESC LIMIT 1',
      [name]
    );

    res.json(sequence);
  } catch (error) {
    console.error('Create email sequence error:', error);
    res.status(500).json({ error: 'Error al crear secuencia' });
  }
};

// Update email sequence (admin)
export const updateEmailSequence = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subject, body, delay_days, delay_hours, is_active, order_index } = req.body;

    if (!name || !subject || !body) {
      return res.status(400).json({ error: 'Nombre, asunto y cuerpo son requeridos' });
    }

    await runQuery(
      'UPDATE email_sequences SET name = ?, subject = ?, body = ?, delay_days = ?, delay_hours = ?, is_active = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, subject, body, delay_days || 0, delay_hours || 0, is_active ? 1 : 0, order_index || 0, id]
    );

    res.json({ message: 'Secuencia actualizada' });
  } catch (error) {
    console.error('Update email sequence error:', error);
    res.status(500).json({ error: 'Error al actualizar secuencia' });
  }
};

// Delete email sequence (admin)
export const deleteEmailSequence = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await runQuery('DELETE FROM email_sequences WHERE id = ?', [id]);

    res.json({ message: 'Secuencia eliminada' });
  } catch (error) {
    console.error('Delete email sequence error:', error);
    res.status(500).json({ error: 'Error al eliminar secuencia' });
  }
};

// Get email logs for a lead (admin)
export const getEmailLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;

    const logs = await allQuery<EmailLog>(
      `SELECT el.*, es.name as sequence_name, es.subject
       FROM email_logs el
       JOIN email_sequences es ON el.sequence_id = es.id
       WHERE el.lead_id = ?
       ORDER BY el.scheduled_at DESC`,
      [leadId]
    );

    res.json(logs);
  } catch (error) {
    console.error('Get email logs error:', error);
    res.status(500).json({ error: 'Error al obtener logs de email' });
  }
};

// Get all email logs (admin)
export const getAllEmailLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = '50', offset = '0' } = req.query;

    let query = `
      SELECT el.*, es.name as sequence_name, es.subject, l.name as lead_name, l.email as lead_email
      FROM email_logs el
      JOIN email_sequences es ON el.sequence_id = es.id
      JOIN leads l ON el.lead_id = l.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ' AND el.status = ?';
      params.push(status);
    }

    query += ' ORDER BY el.scheduled_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const logs = await allQuery<any>(query, params);

    res.json(logs);
  } catch (error) {
    console.error('Get all email logs error:', error);
    res.status(500).json({ error: 'Error al obtener logs de email' });
  }
};
