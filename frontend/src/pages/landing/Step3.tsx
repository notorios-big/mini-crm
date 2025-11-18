import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Calendar, Download, MessageCircle } from 'lucide-react';
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
    // Track Meta Pixel conversion event
    if (config?.meta_pixel_id && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-2xl">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {config?.thank_you_title || '¡Gracias por tu interés!'}
          </h1>
          <p className="text-xl text-gray-200">
            {config?.thank_you_message || 'Nos pondremos en contacto contigo pronto.'}
          </p>
        </div>

        {/* Next Steps Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl animate-slideUp">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Próximos Pasos
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Revisa tu email
                </h3>
                <p className="text-gray-300 text-sm">
                  Te enviaremos información detallada sobre nuestras soluciones
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Agenda una llamada
                </h3>
                <p className="text-gray-300 text-sm">
                  Uno de nuestros expertos se pondrá en contacto contigo en las próximas 24-48 horas
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Recursos adicionales
                </h3>
                <p className="text-gray-300 text-sm">
                  Accede a casos de éxito y material complementario en nuestro sitio web
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 space-y-3">
            <a
              href="https://wa.me/1234567890" // Replace with actual WhatsApp number
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-all transform hover:scale-105"
            >
              Contactar por WhatsApp
            </a>

            <a
              href="mailto:info@notorios.com" // Replace with actual email
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-all transform hover:scale-105"
            >
              Enviar Email
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-300 animate-fadeIn">
          <p className="text-sm mb-2">
            ¿Tienes preguntas? Estamos aquí para ayudarte.
          </p>
          <p className="text-xs">
            © 2024 Notorios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
