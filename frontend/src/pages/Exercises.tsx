import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Exercise } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['Musculation', 'Cardio', 'Flexibilité'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Musculation: 'bg-blue-100 text-blue-700',
  Cardio:      'bg-green-100 text-green-700',
  Flexibilité: 'bg-yellow-100 text-yellow-700',
};

const emptyForm: { name: string; category: Exercise['category']; muscle_group: string; description: string } = {
  name: '', category: 'Musculation', muscle_group: '', description: '',
};

export default function Exercises() {
  const { data, loading, error, refetch } = useFetch<{ exercises: Exercise[] }>('/exercises');
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [form,       setForm]       = useState({ ...emptyForm });
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-red-500">{error}</p>;

  const filtered = (data?.exercises ?? []).filter(e => {
    const matchCat    = !filterCat || e.category === filterCat;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
                        (e.muscle_group?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchCat && matchSearch;
  });

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (ex: Exercise) => {
    setForm({ name: ex.name, category: ex.category, muscle_group: ex.muscle_group || '', description: ex.description || '' });
    setEditId(ex.id);
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Le nom est obligatoire.'); return; }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/exercises/${editId}`, form);
      } else {
        await api.post('/exercises', form);
      }
      setShowForm(false);
      refetch();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Exercices</h2>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Nouvel exercice
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <input
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-48"
        />
        <div className="flex gap-2">
          {['', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCat === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat || 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ex => (
          <div key={ex.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800">{ex.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[ex.category] || 'bg-gray-100 text-gray-600'}`}>
                {ex.category}
              </span>
            </div>
            {ex.muscle_group && <p className="text-xs text-gray-400">{ex.muscle_group}</p>}
            {ex.description  && <p className="text-sm text-gray-600 line-clamp-2">{ex.description}</p>}
            <div className="flex gap-2 mt-auto pt-2">
              <button onClick={() => openEdit(ex)} className="text-sm text-blue-600 hover:underline">Modifier</button>
              <button onClick={() => handleDelete(ex.id)} className="text-sm text-red-500 hover:underline ml-auto">Supprimer</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center py-12">Aucun exercice trouvé.</p>
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editId ? 'Modifier l\'exercice' : 'Nouvel exercice'}</h3>
            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groupe musculaire</label>
                <input value={form.muscle_group} onChange={e => setForm({ ...form, muscle_group: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Pectoraux, Triceps" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
