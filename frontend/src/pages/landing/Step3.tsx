import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Calendar, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { leadsAPI, configAPI } from '../../services/api';
import type { Config } from '../../types';

export default function LandingStep3() {
  const { leadId } = useParams<{ leadId: string }>();
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    loadConfig();
    updateLeadStep();
    trackConversion();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await configAPI.getAll();
      setConfig(data);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const updateLeadStep = async () => {
    if (!leadId) return;

    try {
      await leadsAPI.updateStep(parseInt(leadId), 3);
    } catch (error) {
      console.error('Error updating lead step:', error);
    }
  };

  const trackConversion = () => {
    if (config?.meta_pixel_id && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-6 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Notorios
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Completado</span>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen flex items-center pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-12 animate-fadeIn">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl scale-150 animate-pulse" />
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-full p-8 shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Excelente decisión!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2">
              {config?.thank_you_title || 'Tu registro fue exitoso'}
            </p>
            <p className="text-lg text-gray-400">
              {config?.thank_you_message || 'Nos pondremos en contacto contigo pronto'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 md:p-10 border border-blue-500/20 shadow-2xl mb-8 animate-slideUp">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Qué sigue ahora?
              </h2>
              <p className="text-gray-400">
                Estos son los próximos pasos para comenzar a automatizar tu e-commerce
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    1. Revisa tu email
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Te enviamos toda la información detallada sobre cómo funciona nuestra metodología y casos de éxito de otros e-commerce
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    2. Agenda una sesión estratégica
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Nuestro equipo se pondrá en contacto en las próximas 24-48 horas para agendar una sesión de análisis de tu e-commerce
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    3. Recibe tu plan de automatización
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Crearemos un plan personalizado para automatizar tu operación, basado en tu modelo de negocio y objetivos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <a
              href="https://wa.me/1234567890?text=Hola,%20acabo%20de%20ver%20el%20video%20y%20quiero%20más%20información"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
            >
              <MessageCircle className="w-5 h-5" />
              Contáctanos por WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="mailto:info@notorios.com?subject=Consulta sobre automatización"
              className="group flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold transition-all border border-slate-700 hover:border-blue-500/50"
            >
              <Calendar className="w-5 h-5" />
              Agendar Llamada
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Respuesta garantizada en menos de 24 horas</span>
            </div>
            <p className="text-xs text-gray-500">
              Tu información está 100% segura. No compartimos tus datos.
            </p>
          </div>

          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>© 2024 Notorios. Todos los derechos reservados.</p>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
