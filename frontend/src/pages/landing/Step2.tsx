import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { leadsAPI, configAPI } from '../../services/api';
import type { Config } from '../../types';

export default function LandingStep2() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => {
    loadConfig();
    updateLeadStep();
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

  const handleVideoEnd = () => {
    setVideoWatched(true);
    if (leadId) {
      leadsAPI.updateStep(parseInt(leadId), 2, true);
    }
  };

  const handleContinue = () => {
    navigate(`/gracias/${leadId}`);
  };

  const getVideoEmbedUrl = () => {
    const videoUrl = config?.video_url || '';
    const videoType = config?.video_type || 'youtube';

    if (!videoUrl) return '';

    if (videoType === 'youtube') {
      // Extract video ID from YouTube URL
      const videoId = videoUrl.includes('youtube.com')
        ? new URL(videoUrl).searchParams.get('v')
        : videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
    } else if (videoType === 'vimeo') {
      // Extract video ID from Vimeo URL
      const videoId = videoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return videoUrl;
  };

  const embedUrl = getVideoEmbedUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Descubre Cómo Podemos Ayudarte
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Mira esta presentación para conocer más sobre nuestras soluciones
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl animate-slideUp">
          <div className="relative aspect-video">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  // Set a timer to mark video as watched after reasonable time
                  setTimeout(() => setVideoWatched(true), 30000); // 30 seconds
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <p>Video no configurado</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center animate-fadeIn">
          <button
            onClick={handleContinue}
            className={`inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 ${
              !videoWatched ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Siguiente
            <ArrowRight className="w-5 h-5" />
          </button>

          {!videoWatched && (
            <p className="mt-4 text-sm text-gray-400">
              Mira el video completo para continuar
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            © 2024 Notorios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
