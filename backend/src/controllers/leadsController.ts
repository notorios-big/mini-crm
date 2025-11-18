import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../config/database';
import { Lead, LeadWithTags, Tag, Note, DashboardStats } from '../models/types';
import { AuthRequest } from '../middleware/auth';

// Create a new lead (public endpoint for landing page)
export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, city, country } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Nombre, email y teléfono son requeridos' });
    }

    // Check if lead already exists
    const existingLead = await getQuery<Lead>('SELECT * FROM leads WHERE email = ?', [email]);

    if (existingLead) {
      // Update the existing lead
      await runQuery(
        'UPDATE leads SET name = ?, phone = ?, city = ?, country = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
        [name, phone, city || null, country || null, email]
      );

      return res.json({ id: existingLead.id, message: 'Lead actualizado' });
    }

    // Insert new lead
    await runQuery(
      'INSERT INTO leads (name, email, phone, city, country, status, current_step) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, city || null, country || null, 'new', 1]
    );

    const lead = await getQuery<Lead>('SELECT * FROM leads WHERE email = ?', [email]);

    // Schedule email sequences for new lead (will be picked up by cron)
    const sequences = await allQuery('SELECT * FROM email_sequences WHERE is_active = 1 ORDER BY order_index');

    for (const sequence of sequences) {
      const delayMs = (sequence.delay_days * 24 * 60 * 60 * 1000) + (sequence.delay_hours * 60 * 60 * 1000);
      const scheduledAt = new Date(Date.now() + delayMs).toISOString();

      await runQuery(
        'INSERT INTO email_logs (lead_id, sequence_id, status, scheduled_at) VALUES (?, ?, ?, ?)',
        [lead?.id, sequence.id, 'pending', scheduledAt]
      );
    }

    res.json({ id: lead?.id, message: 'Lead creado exitosamente' });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Error al crear lead' });
  }
};

// Update lead step (public endpoint)
export const updateLeadStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { step, watchedVideo } = req.body;

    await runQuery(
      'UPDATE leads SET current_step = ?, watched_video = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [step, watchedVideo ? 1 : 0, id]
    );

    res.json({ message: 'Step actualizado' });
  } catch (error) {
    console.error('Update lead step error:', error);
    res.status(500).json({ error: 'Error al actualizar step' });
  }
};

// Get all leads with filters (admin)
export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, tag, startDate, endDate, limit = '50', offset = '0' } = req.query;

    let query = `
      SELECT DISTINCT l.*,
        GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color) as tags
      FROM leads l
      LEFT JOIN lead_tags lt ON l.id = lt.lead_id
      LEFT JOIN tags t ON lt.tag_id = t.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (tag) {
      query += ' AND t.id = ?';
      params.push(tag);
    }

    if (startDate) {
      query += ' AND l.created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND l.created_at <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY l.id ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const leads = await allQuery<any>(query, params);

    // Parse tags
    const leadsWithTags = leads.map((lead) => {
      const tags: Tag[] = [];
      if (lead.tags) {
        const tagStrings = lead.tags.split(',');
        tagStrings.forEach((tagStr: string) => {
          const [id, name, color] = tagStr.split(':');
          if (id && name && color) {
            tags.push({ id: parseInt(id), name, color, created_at: '' });
          }
        });
      }
      delete lead.tags;
      return { ...lead, tags };
    });

    // Get total count
    let countQuery = 'SELECT COUNT(DISTINCT l.id) as total FROM leads l';
    if (tag) {
      countQuery += ' LEFT JOIN lead_tags lt ON l.id = lt.lead_id LEFT JOIN tags t ON lt.tag_id = t.id';
    }
    countQuery += ' WHERE 1=1';

    const countParams: any[] = [];
    if (status) {
      countQuery += ' AND l.status = ?';
      countParams.push(status);
    }
    if (search) {
      countQuery += ' AND (l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    if (tag) {
      countQuery += ' AND t.id = ?';
      countParams.push(tag);
    }
    if (startDate) {
      countQuery += ' AND l.created_at >= ?';
      countParams.push(startDate);
    }
    if (endDate) {
      countQuery += ' AND l.created_at <= ?';
      countParams.push(endDate);
    }

    const countResult = await getQuery<{ total: number }>(countQuery, countParams);

    res.json({
      leads: leadsWithTags,
      total: countResult?.total || 0,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Error al obtener leads' });
  }
};

// Get single lead with details (admin)
export const getLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const lead = await getQuery<Lead>('SELECT * FROM leads WHERE id = ?', [id]);

    if (!lead) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }

    // Get tags
    const tags = await allQuery<Tag>(
      `SELECT t.* FROM tags t
       JOIN lead_tags lt ON t.id = lt.tag_id
       WHERE lt.lead_id = ?`,
      [id]
    );

    // Get notes
    const notes = await allQuery<Note>(
      `SELECT n.*, u.name as user_name
       FROM notes n
       JOIN users u ON n.user_id = u.id
       WHERE n.lead_id = ?
       ORDER BY n.created_at DESC`,
      [id]
    );

    res.json({ ...lead, tags, notes });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Error al obtener lead' });
  }
};

// Update lead status (admin)
export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'qualified', 'client', 'discarded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    await runQuery('UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);

    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// Add tag to lead (admin)
export const addTagToLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tagId } = req.body;

    await runQuery('INSERT OR IGNORE INTO lead_tags (lead_id, tag_id) VALUES (?, ?)', [id, tagId]);

    res.json({ message: 'Etiqueta agregada' });
  } catch (error) {
    console.error('Add tag error:', error);
    res.status(500).json({ error: 'Error al agregar etiqueta' });
  }
};

// Remove tag from lead (admin)
export const removeTagFromLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id, tagId } = req.params;

    await runQuery('DELETE FROM lead_tags WHERE lead_id = ? AND tag_id = ?', [id, tagId]);

    res.json({ message: 'Etiqueta eliminada' });
  } catch (error) {
    console.error('Remove tag error:', error);
    res.status(500).json({ error: 'Error al eliminar etiqueta' });
  }
};

// Add note to lead (admin)
export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    await runQuery('INSERT INTO notes (lead_id, user_id, content) VALUES (?, ?, ?)', [
      id,
      req.user.id,
      content,
    ]);

    res.json({ message: 'Nota agregada' });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Error al agregar nota' });
  }
};

// Get dashboard stats (admin)
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalLeads = await getQuery<{ count: number }>('SELECT COUNT(*) as count FROM leads', []);

    const newLeads = await getQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM leads WHERE status = 'new'",
      []
    );

    const contactedLeads = await getQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM leads WHERE status = 'contacted'",
      []
    );

    const qualifiedLeads = await getQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM leads WHERE status = 'qualified'",
      []
    );

    const clients = await getQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM leads WHERE status = 'client'",
      []
    );

    const step1 = await getQuery<{ count: number }>('SELECT COUNT(*) as count FROM leads WHERE current_step >= 1', []);

    const step2 = await getQuery<{ count: number }>('SELECT COUNT(*) as count FROM leads WHERE current_step >= 2', []);

    const step3 = await getQuery<{ count: number }>('SELECT COUNT(*) as count FROM leads WHERE current_step >= 3', []);

    const today = new Date().toISOString().split('T')[0];
    const leadsToday = await getQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM leads WHERE DATE(created_at) = ?',
      [today]
    );

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const leadsThisWeek = await getQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM leads WHERE created_at >= ?',
      [weekAgo]
    );

    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const leadsThisMonth = await getQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM leads WHERE created_at >= ?',
      [monthAgo]
    );

    const conversionRate = totalLeads?.count ? ((clients?.count || 0) / totalLeads.count) * 100 : 0;

    const stats: DashboardStats = {
      total_leads: totalLeads?.count || 0,
      new_leads: newLeads?.count || 0,
      contacted_leads: contactedLeads?.count || 0,
      qualified_leads: qualifiedLeads?.count || 0,
      clients: clients?.count || 0,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      step_1_completions: step1?.count || 0,
      step_2_completions: step2?.count || 0,
      step_3_completions: step3?.count || 0,
      leads_today: leadsToday?.count || 0,
      leads_this_week: leadsThisWeek?.count || 0,
      leads_this_month: leadsThisMonth?.count || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Delete lead (admin)
export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await runQuery('DELETE FROM leads WHERE id = ?', [id]);

    res.json({ message: 'Lead eliminado' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Error al eliminar lead' });
  }
};
