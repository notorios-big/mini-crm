import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Zap, Target, X, CheckCircle } from 'lucide-react';
import { leadsAPI, configAPI } from '../../services/api';
import toast from 'react-hot-toast';
import type { LeadFormData, Config } from '../../types';

export default function LandingStep1() {
  const [showModal, setShowModal] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Notorios
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium">
              <Zap className="w-4 h-4" />
              Metodología Estratégica de Control IA
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Escala tu{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                E-commerce
              </span>
              <br />
              sin contratar más personal
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Ayudo a dueños de e-commerce que venden <span className="text-white font-semibold">+$30K/mes</span> a
              automatizar su operación y fortalecer su marca{' '}
              <span className="text-blue-400 font-semibold">sin volverse esclavos de su propio crecimiento</span>
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Automatiza procesos repetitivos con IA',
                'Escala sin aumentar tu equipo',
                'Fortalece tu marca y posicionamiento',
                'Recupera tu tiempo y libertad'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowModal(true)}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-5 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <Play className="w-6 h-6 fill-current" />
              Ver Cómo Funciona (Video)
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-violet-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </button>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-2 border-slate-900" />
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  {'★'.repeat(5)}
                </div>
                <p>Más de 150+ e-commerce automatizados</p>
              </div>
            </div>
          </div>

          {/* Right Column - Video Preview */}
          <div className="relative animate-slideUp lg:block hidden">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-blue-500/20">
              <img
                src={coverImage}
                alt="Video preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Play Button */}
              <button
                onClick={() => setShowModal(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl scale-150 group-hover:scale-175 transition-transform" />
                  <div className="relative bg-white rounded-full p-8 shadow-2xl transform group-hover:scale-110 transition-all">
                    <Play className="w-12 h-12 text-blue-600 fill-current" />
                  </div>
                </div>
              </button>

              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white">12min</div>
                  <div className="text-xs text-gray-300">Duración</div>
                </div>
                <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white">3 Pasos</div>
                  <div className="text-xs text-gray-300">Sistema Completo</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl p-4 shadow-xl animate-bounce">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-4 shadow-xl animate-pulse">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-blue-500/20 animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full mb-4">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Accede al Video Completo
              </h3>
              <p className="text-gray-400">
                Descubre cómo automatizar tu e-commerce en 3 simples pasos
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email corporativo *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <input
                  type="text"
                  placeholder="País"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/50"
              >
                {loading ? 'Cargando...' : 'Acceder al Video Ahora →'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                🔒 Tu información está 100% segura. No spam.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
