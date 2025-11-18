import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { leadsAPI, configAPI } from '../../services/api';
import toast from 'react-hot-toast';
import type { LeadFormData, Config } from '../../types';

export default function LandingStep1() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await configAPI.getAll();
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await leadsAPI.create(formData);
      toast.success('¡Gracias! Redirigiendo al video...');

      // Track Meta Pixel event if configured
      if (config?.meta_pixel_id && typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      setTimeout(() => {
        navigate(`/video/${response.id}`);
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al enviar el formulario');
      setLoading(false);
    }
  };

  const coverImage = config?.cover_image || '/placeholder-cover.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {config?.landing_title || 'Descubre el Poder de la Automatización con IA'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            {config?.landing_subtitle || 'Transforma tu negocio con soluciones inteligentes de Notorios'}
          </p>
        </div>

        {/* Video/Form Container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl animate-slideUp">
          <div className="relative aspect-video">
            {/* Cover Image */}
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />

            {/* Play Button Overlay (before form is shown) */}
            {!showForm && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative"
                  aria-label="Reproducir video"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform" />
                  <div className="relative bg-white rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all">
                    <Play className="w-16 h-16 text-primary-600 fill-current" />
                  </div>
                </button>
              </div>
            )}

            {/* Form Overlay */}
            {showForm && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/90 to-black/80 backdrop-blur-sm p-6">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                  <h3 className="text-2xl font-bold text-white text-center mb-6">
                    Ingresa tus datos para continuar
                  </h3>

                  <input
                    type="text"
                    placeholder="Nombre completo *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  <input
                    type="tel"
                    placeholder="Teléfono / WhatsApp *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />

                    <input
                      type="text"
                      placeholder="País"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Enviando...' : (config?.landing_cta || 'Ver Presentación')}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    * Campos requeridos. Tu información está segura con nosotros.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-300 animate-fadeIn">
          <p className="text-sm">
            © 2024 Notorios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
