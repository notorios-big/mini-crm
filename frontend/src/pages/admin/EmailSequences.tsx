import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import { emailAPI } from '../../services/api';
import type { EmailSequence } from '../../types';
import toast from 'react-hot-toast';

export default function EmailSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSequence, setEditingSequence] = useState<EmailSequence | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    delay_days: 0,
    delay_hours: 0,
    is_active: true,
    order_index: 0,
  });

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      const data = await emailAPI.getSequences();
      setSequences(data);
    } catch (error) {
      toast.error('Error al cargar secuencias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSequence) {
        await emailAPI.updateSequence(editingSequence.id, formData);
        toast.success('Secuencia actualizada');
      } else {
        await emailAPI.createSequence(formData);
        toast.success('Secuencia creada');
      }
      setShowModal(false);
      resetForm();
      loadSequences();
    } catch (error) {
      toast.error('Error al guardar secuencia');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta secuencia?')) return;

    try {
      await emailAPI.deleteSequence(id);
      toast.success('Secuencia eliminada');
      loadSequences();
    } catch (error) {
      toast.error('Error al eliminar secuencia');
    }
  };

  const handleEdit = (sequence: EmailSequence) => {
    setEditingSequence(sequence);
    setFormData({
      name: sequence.name,
      subject: sequence.subject,
      body: sequence.body,
      delay_days: sequence.delay_days,
      delay_hours: sequence.delay_hours,
      is_active: sequence.is_active,
      order_index: sequence.order_index,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSequence(null);
    setFormData({
      name: '',
      subject: '',
      body: '',
      delay_days: 0,
      delay_hours: 0,
      is_active: true,
      order_index: 0,
    });
  };

  if (loading) {
    return <div className="flex justify-center"><div className="w-16 h-16 spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Secuencias de Email</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configura emails automáticos para nuevos leads
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Secuencia
        </button>
      </div>

      <div className="grid gap-4">
        {sequences.map((seq) => (
          <div key={seq.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{seq.name}</h3>
                  {seq.is_active ? (
                    <span className="badge bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <Power className="w-3 h-3 mr-1 inline" /> Activo
                    </span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      <PowerOff className="w-3 h-3 mr-1 inline" /> Inactivo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Asunto:</strong> {seq.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Delay:</strong> {seq.delay_days} días, {seq.delay_hours} horas
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {seq.body.replace(/<[^>]*>/g, '')}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleEdit(seq)} className="text-primary-600 hover:text-primary-700">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(seq.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {sequences.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No hay secuencias configuradas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingSequence ? 'Editar' : 'Nueva'} Secuencia
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Asunto</label>
                  <input required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input" placeholder="Usa {nombre} para personalizar" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cuerpo (HTML permitido)</label>
                  <textarea required value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="input min-h-[200px]" placeholder="Usa {nombre}, {email}, {phone} para personalizar" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Días de retraso</label>
                    <input type="number" min="0" value={formData.delay_days} onChange={(e) => setFormData({ ...formData, delay_days: parseInt(e.target.value) })} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Horas de retraso</label>
                    <input type="number" min="0" max="23" value={formData.delay_hours} onChange={(e) => setFormData({ ...formData, delay_hours: parseInt(e.target.value) })} className="input" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded" />
                  <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">Activo</label>
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
