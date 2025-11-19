import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { leadsAPI, configAPI } from '../../services/api';
import type { Config } from '../../types';

export default function LandingStep2() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    loadConfig();
    updateLeadStep();

    const timer = setTimeout(() => {
      setVideoWatched(true);
    }, 30000);

    const interval = setInterval(() => {
      setWatchTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
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
      await leadsAPI.updateStep(parseInt(leadId), 2);
    } catch (error) {
      console.error('Error updating lead step:', error);
    }
  };

  const handleContinue = () => {
    if (leadId) {
      leadsAPI.updateStep(parseInt(leadId), 2, true);
    }
    navigate(`/gracias/${leadId}`);
  };

  const getVideoEmbedUrl = () => {
    const videoUrl = config?.video_url || '';
    const videoType = config?.video_type || 'youtube';

    if (!videoUrl) return '';

    if (videoType === 'youtube') {
      const videoId = videoUrl.includes('youtube.com')
        ? new URL(videoUrl).searchParams.get('v')
        : videoUrl.split('/').pop();
      return 'https://www.youtube.com/embed/' + videoId + '?rel=0&enablejsapi=1&modestbranding=1';
    } else if (videoType === 'vimeo') {
      const videoId = videoUrl.split('/').pop();
      return 'https://player.vimeo.com/video/' + videoId + '?title=0&byline=0&portrait=0';
    }

    return videoUrl;
  };

  const embedUrl = getVideoEmbedUrl();
  const minutes = Math.floor(watchTime / 60);
  const seconds = watchTime % 60;

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
            <span>Paso 2 de 3</span>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen flex items-center pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Video Exclusivo
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Descubre el{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Sistema Completo
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En este video verás exactamente cómo automatizar tu e-commerce con IA y recuperar tu tiempo
            </p>
          </div>

          <div className="relative mb-8 animate-slideUp">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-blue-500/20 bg-slate-900">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <p className="text-gray-400">Video no configurado</p>
                  </div>
                </div>
              )}
            </div>

            {watchTime > 0 && (
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <div className="text-sm text-gray-300">
                  Tiempo de visualización: {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: '3 Pilares Fundamentales', desc: 'El sistema que te permite escalar sin contratar' },
              { title: 'Casos de Éxito Reales', desc: 'E-commerce que ya están automatizados' },
              { title: 'Próximos Pasos', desc: 'Cómo implementarlo en tu negocio' }
            ].map((point, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800 hover:border-blue-500/30 transition-all">
                <div className="text-3xl font-bold text-blue-400 mb-2">{index + 1}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-gray-400 text-sm">{point.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!videoWatched}
              className={'inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-5 rounded-xl text-lg font-semibold transition-all transform ' + (videoWatched ? 'hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50' : 'opacity-50 cursor-not-allowed')}
            >
              Continuar al Siguiente Paso
              <ArrowRight className="w-5 h-5" />
            </button>

            {!videoWatched && (
              <p className="mt-4 text-sm text-gray-500">
                Mira el video para continuar (se habilitará en 30 segundos)
              </p>
            )}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
