import { useEffect, useState } from 'react';
import { Save, Upload, Settings as SettingsIcon } from 'lucide-react';
import { configAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    video_url: '',
    video_type: 'youtube',
    landing_title: '',
    landing_subtitle: '',
    landing_cta: '',
    thank_you_title: '',
    thank_you_message: '',
    cover_image: '',
    meta_pixel_id: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    smtp_from: '',
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await configAPI.getAll();
      setConfig({ ...config, ...data });
    } catch (error) {
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const configs = Object.entries(config).map(([key, value]) => ({ key, value: String(value) }));
      await configAPI.bulkUpdate(configs);
      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await configAPI.uploadCover(file);
      setConfig({ ...config, cover_image: url });
      toast.success('Imagen subida');
    } catch (error) {
      toast.error('Error al subir imagen');
    }
  };

  if (loading) {
    return <div className="flex justify-center"><div className="w-16 h-16 spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Configuración
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Configura tu landing page y sistema CRM
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Landing Page */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Landing Page</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Título Principal</label>
              <input
                value={config.landing_title}
                onChange={(e) => setConfig({ ...config, landing_title: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subtítulo</label>
              <input
                value={config.landing_subtitle}
                onChange={(e) => setConfig({ ...config, landing_subtitle: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Texto del Botón</label>
              <input
                value={config.landing_cta}
                onChange={(e) => setConfig({ ...config, landing_cta: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Imagen de Portada</label>
              <div className="flex gap-4 items-center">
                {config.cover_image && (
                  <img src={config.cover_image} alt="Cover" className="w-32 h-20 object-cover rounded" />
                )}
                <label className="btn btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Subir Imagen
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Video Configuration */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Video</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tipo de Video</label>
              <select
                value={config.video_type}
                onChange={(e) => setConfig({ ...config, video_type: e.target.value })}
                className="input"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL del Video</label>
              <input
                value={config.video_url}
                onChange={(e) => setConfig({ ...config, video_url: e.target.value })}
                className="input"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Thank You Page */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Página de Agradecimiento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Título</label>
              <input
                value={config.thank_you_title}
                onChange={(e) => setConfig({ ...config, thank_you_title: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mensaje</label>
              <textarea
                value={config.thank_you_message}
                onChange={(e) => setConfig({ ...config, thank_you_message: e.target.value })}
                className="input"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meta Pixel (Facebook)</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Pixel ID</label>
            <input
              value={config.meta_pixel_id}
              onChange={(e) => setConfig({ ...config, meta_pixel_id: e.target.value })}
              className="input"
              placeholder="123456789012345"
            />
            <p className="text-sm text-gray-500 mt-1">Opcional: Para rastrear conversiones en Facebook Ads</p>
          </div>
        </div>

        {/* SMTP Configuration */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Configuración de Email (SMTP)</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Host SMTP</label>
                <input
                  value={config.smtp_host}
                  onChange={(e) => setConfig({ ...config, smtp_host: e.target.value })}
                  className="input"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Puerto</label>
                <input
                  value={config.smtp_port}
                  onChange={(e) => setConfig({ ...config, smtp_port: e.target.value })}
                  className="input"
                  placeholder="587"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Usuario</label>
              <input
                value={config.smtp_user}
                onChange={(e) => setConfig({ ...config, smtp_user: e.target.value })}
                className="input"
                placeholder="tu-email@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contraseña</label>
              <input
                type="password"
                value={config.smtp_password}
                onChange={(e) => setConfig({ ...config, smtp_password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email de Origen</label>
              <input
                value={config.smtp_from}
                onChange={(e) => setConfig({ ...config, smtp_from: e.target.value })}
                className="input"
                placeholder="noreply@notorios.com"
              />
            </div>
            <p className="text-sm text-gray-500">
              Para Gmail, usa una contraseña de aplicación. <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Más información</a>
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary inline-flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
