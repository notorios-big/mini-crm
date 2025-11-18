import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { tagsAPI } from '../../services/api';
import type { Tag } from '../../types';
import toast from 'react-hot-toast';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e',
];

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: PRESET_COLORS[0] });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await tagsAPI.getAll();
      setTags(data);
    } catch (error) {
      toast.error('Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await tagsAPI.update(editingTag.id, formData.name, formData.color);
        toast.success('Etiqueta actualizada');
      } else {
        await tagsAPI.create(formData.name, formData.color);
        toast.success('Etiqueta creada');
      }
      setShowModal(false);
      resetForm();
      loadTags();
    } catch (error) {
      toast.error('Error al guardar etiqueta');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta etiqueta?')) return;

    try {
      await tagsAPI.delete(id);
      toast.success('Etiqueta eliminada');
      loadTags();
    } catch (error) {
      toast.error('Error al eliminar etiqueta');
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingTag(null);
    setFormData({ name: '', color: PRESET_COLORS[0] });
  };

  if (loading) {
    return <div className="flex justify-center"><div className="w-16 h-16 spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Etiquetas</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Organiza tus leads con etiquetas personalizadas</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Etiqueta
        </button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="font-medium text-gray-900 dark:text-white">{tag.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(tag)} className="text-primary-600 hover:text-primary-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {tags.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No hay etiquetas configuradas
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingTag ? 'Editar' : 'Nueva'} Etiqueta
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Color</label>
                  <div className="grid grid-cols-9 gap-2 mt-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary-600' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
