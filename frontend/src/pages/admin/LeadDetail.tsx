import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Tag as TagIcon, StickyNote } from 'lucide-react';
import { leadsAPI, tagsAPI } from '../../services/api';
import type { Lead, Tag } from '../../types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'client', label: 'Cliente' },
  { value: 'discarded', label: 'Descartado' },
];

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    if (id) {
      loadLead();
      loadTags();
    }
  }, [id]);

  const loadLead = async () => {
    try {
      const data = await leadsAPI.getOne(parseInt(id!));
      setLead(data);
    } catch (error) {
      toast.error('Error al cargar lead');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const data = await tagsAPI.getAll();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    try {
      await leadsAPI.updateStatus(parseInt(id), newStatus);
      toast.success('Estado actualizado');
      loadLead();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleAddTag = async () => {
    if (!id || !selectedTag) return;

    try {
      await leadsAPI.addTag(parseInt(id), parseInt(selectedTag));
      toast.success('Etiqueta agregada');
      setSelectedTag('');
      loadLead();
    } catch (error) {
      toast.error('Error al agregar etiqueta');
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!id) return;

    try {
      await leadsAPI.removeTag(parseInt(id), tagId);
      toast.success('Etiqueta eliminada');
      loadLead();
    } catch (error) {
      toast.error('Error al eliminar etiqueta');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !note.trim()) return;

    try {
      await leadsAPI.addNote(parseInt(id), note);
      toast.success('Nota agregada');
      setNote('');
      loadLead();
    } catch (error) {
      toast.error('Error al agregar nota');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 spinner"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Lead no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/admin/leads" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a Leads
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`https://wa.me/${lead.phone}`} className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">{lead.phone}</a>
              </div>
              {(lead.city || lead.country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {[lead.city, lead.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Registrado: {new Date(lead.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Notas
            </h3>
            <form onSubmit={handleAddNote} className="mb-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar nota..."
                className="input min-h-[100px]"
              />
              <button type="submit" className="btn btn-primary mt-2">
                Agregar Nota
              </button>
            </form>
            <div className="space-y-3">
              {lead.notes?.map((note) => (
                <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {note.user_name} - {new Date(note.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
              {(!lead.notes || lead.notes.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay notas aún
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado</h3>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Etiquetas
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="input flex-1"
                >
                  <option value="">Seleccionar...</option>
                  {tags.filter((tag) => !lead.tags?.find((t) => t.id === tag.id)).map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddTag} disabled={!selectedTag} className="btn btn-primary">
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {lead.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progreso</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Paso actual:</span>
                <span className="font-medium text-gray-900 dark:text-white">{lead.current_step}/3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Video visto:</span>
                <span className={`font-medium ${lead.watched_video ? 'text-green-600' : 'text-gray-400'}`}>
                  {lead.watched_video ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
