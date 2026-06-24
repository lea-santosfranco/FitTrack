import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Workout } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const emptyForm = { title: '', date: new Date().toISOString().slice(0, 10), duration: '', notes: '' };

export default function Workouts() {
  const { data, loading, error, refetch } = useFetch<{ workouts: Workout[] }>('/workouts');
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({ ...emptyForm });
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-red-500">{error}</p>;

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date) { setFormError('Titre et date obligatoires.'); return; }
    setSaving(true);
    try {
      await api.post('/workouts', { ...form, duration: form.duration ? Number(form.duration) : undefined });
      setShowForm(false);
      setForm({ ...emptyForm });
      refetch();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette séance ?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      refetch();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Mes séances</h2>
        <button onClick={() => { setForm({ ...emptyForm }); setFormError(''); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Nouvelle séance
        </button>
      </div>

      {(data?.workouts ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg font-medium">Aucune séance pour l'instant</p>
          <p className="text-sm mt-2">Créez votre première séance d'entraînement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data!.workouts.map(w => (
            <div key={w.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div>
                <Link to={`/workouts/${w.id}`} className="font-semibold text-gray-800 hover:text-blue-600 text-lg">
                  {w.title}
                </Link>
                <div className="flex gap-3 text-sm text-gray-400 mt-1">
                  <span>📅 {w.date?.slice(0, 10)}</span>
                  {w.duration && <span>⏱️ {w.duration} min</span>}
                  {w.exercise_count !== undefined && <span>🏋️ {w.exercise_count} exercice(s)</span>}
                </div>
                {w.notes && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{w.notes}</p>}
              </div>
              <div className="flex gap-2">
                <Link to={`/workouts/${w.id}`}
                  className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
                  Détail
                </Link>
                <button onClick={() => handleDelete(w.id)}
                  className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Nouvelle séance</h3>
            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Push day, Cardio matinal..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
