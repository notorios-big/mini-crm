import { Request, Response } from 'express';
import { runQuery, getQuery, allQuery } from '../config/database';
import { Config } from '../models/types';
import { AuthRequest } from '../middleware/auth';

// Get all configuration (public for landing page)
export const getConfig = async (req: Request, res: Response) => {
  try {
    const configs = await allQuery<Config>('SELECT * FROM config', []);

    const configObject: Record<string, string> = {};
    configs.forEach((config) => {
      configObject[config.key] = config.value;
    });

    res.json(configObject);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

// Get single config value (public)
export const getConfigValue = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const config = await getQuery<Config>('SELECT * FROM config WHERE key = ?', [key]);

    if (!config) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    res.json({ value: config.value });
  } catch (error) {
    console.error('Get config value error:', error);
    res.status(500).json({ error: 'Error al obtener valor' });
  }
};

// Update configuration (admin)
export const updateConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Key es requerida' });
    }

    await runQuery(
      'INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP',
      [key, value, value]
    );

    res.json({ message: 'Configuración actualizada' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};

// Bulk update configuration (admin)
export const bulkUpdateConfig = async (req: AuthRequest, res: Response) => {
  try {
    const configs = req.body;

    if (!Array.isArray(configs)) {
      return res.status(400).json({ error: 'Se esperaba un array de configuraciones' });
    }

    for (const config of configs) {
      await runQuery(
        'INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP',
        [config.key, config.value, config.value]
      );
    }

    res.json({ message: 'Configuraciones actualizadas' });
  } catch (error) {
    console.error('Bulk update config error:', error);
    res.status(500).json({ error: 'Error al actualizar configuraciones' });
  }
};
