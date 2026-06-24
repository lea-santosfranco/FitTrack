import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Workout, Exercise, WorkoutExercise } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function WorkoutDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch<{ workout: Workout }>(`/workouts/${id}`);
  const { data: exData } = useFetch<{ exercises: Exercise[] }>('/exercises');

  const [addingEx,    setAddingEx]    = useState(false);
  const [selectedEx,  setSelectedEx]  = useState('');
  const [exForm,      setExForm]      = useState({ sets: '', reps: '', weight_used: '', duration: '' });
  const [editingWe,   setEditingWe]   = useState<WorkoutExercise | null>(null);
  const [editForm,    setEditForm]    = useState({ sets: '', reps: '', weight_used: '', duration: '' });
  const [saving,      setSaving]      = useState(false);

  const [editWorkout, setEditWorkout] = useState(false);
  const [wForm,       setWForm]       = useState({ title: '', date: '', duration: '', notes: '' });

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <p className="text-red-500">{error || 'Séance introuvable.'}</p>;

  const workout = data.workout;

  const handleDeleteWorkout = async () => {
    if (!confirm('Supprimer cette séance ?')) return;
    await api.delete(`/workouts/${id}`);
    navigate('/workouts');
  };

  const handleEditWorkout = () => {
    setWForm({
      title:    workout.title,
      date:     workout.date?.slice(0, 10),
      duration: workout.duration?.toString() || '',
      notes:    workout.notes || '',
    });
    setEditWorkout(true);
  };

  const handleSaveWorkout = async () => {
    setSaving(true);
    try {
      await api.put(`/workouts/${id}`, { ...wForm, duration: wForm.duration ? Number(wForm.duration) : undefined });
      setEditWorkout(false);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleAddExercise = async () => {
    if (!selectedEx) return;
    setSaving(true);
    try {
      await api.post(`/workouts/${id}/exercises`, {
        exercise_id: Number(selectedEx),
        sets:        exForm.sets        ? Number(exForm.sets)        : undefined,
        reps:        exForm.reps        ? Number(exForm.reps)        : undefined,
        weight_used: exForm.weight_used ? Number(exForm.weight_used) : undefined,
        duration:    exForm.duration    ? Number(exForm.duration)    : undefined,
      });
      setAddingEx(false);
      setSelectedEx('');
      setExForm({ sets: '', reps: '', weight_used: '', duration: '' });
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const openEditWe = (we: WorkoutExercise) => {
    setEditingWe(we);
    setEditForm({
      sets:        we.sets?.toString()        || '',
      reps:        we.reps?.toString()        || '',
      weight_used: we.weight_used?.toString() || '',
      duration:    we.duration?.toString()    || '',
    });
  };

  const handleSaveWe = async () => {
    if (!editingWe) return;
    setSaving(true);
    try {
      await api.patch(`/workouts/${id}/exercises/${editingWe.we_id}`, {
        sets:        editForm.sets        ? Number(editForm.sets)        : undefined,
        reps:        editForm.reps        ? Number(editForm.reps)        : undefined,
        weight_used: editForm.weight_used ? Number(editForm.weight_used) : undefined,
        duration:    editForm.duration    ? Number(editForm.duration)    : undefined,
      });
      setEditingWe(null);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEx = async (weId: number) => {
    if (!confirm('Retirer cet exercice ?')) return;
    await api.delete(`/workouts/${id}/exercises/${weId}`);
    refetch();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* En-tête séance */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {editWorkout ? (
          <div className="space-y-4">
            <input value={wForm.title} onChange={e => setWForm({ ...wForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={wForm.date} onChange={e => setWForm({ ...wForm, date: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" value={wForm.duration} onChange={e => setWForm({ ...wForm, duration: e.target.value })}
                placeholder="Durée (min)" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <textarea value={wForm.notes} onChange={e => setWForm({ ...wForm, notes: e.target.value })} rows={2}
              placeholder="Notes..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-3">
              <button onClick={() => setEditWorkout(false)} className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSaveWorkout} disabled={saving} className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{workout.title}</h2>
                <div className="flex gap-4 text-sm text-gray-400 mt-2">
                  <span>📅 {workout.date?.slice(0, 10)}</span>
                  {workout.duration && <span>⏱️ {workout.duration} min</span>}
                </div>
                {workout.notes && <p className="text-gray-600 mt-3 text-sm">{workout.notes}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={handleEditWorkout} className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">Modifier</button>
                <button onClick={handleDeleteWorkout} className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Exercices */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Exercices</h3>
          <button onClick={() => setAddingEx(true)} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
            + Ajouter
          </button>
        </div>

        {(workout.exercises ?? []).length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">Aucun exercice dans cette séance.</p>
        ) : (
          <div className="space-y-3">
            {workout.exercises!.map(we => (
              <div key={we.we_id} className="border border-gray-200 rounded-xl p-4">
                {editingWe?.we_id === we.we_id ? (
                  <div className="space-y-3">
                    <p className="font-medium">{we.name}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['sets', 'reps', 'weight_used', 'duration'].map(field => (
                        <div key={field}>
                          <label className="block text-xs text-gray-400 mb-1">
                            {field === 'sets' ? 'Séries' : field === 'reps' ? 'Reps' : field === 'weight_used' ? 'Poids (kg)' : 'Durée (s)'}
                          </label>
                          <input type="number" value={(editForm as any)[field]}
                            onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingWe(null)} className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">Annuler</button>
                      <button onClick={handleSaveWe} disabled={saving} className="text-sm bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 disabled:opacity-60">
                        {saving ? '...' : 'Sauvegarder'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{we.name}</p>
                      <p className="text-xs text-gray-400">{we.category}{we.muscle_group ? ` · ${we.muscle_group}` : ''}</p>
                      <div className="flex gap-3 mt-1 text-sm text-gray-600">
                        {we.sets        && <span>{we.sets} séries</span>}
                        {we.reps        && <span>× {we.reps} reps</span>}
                        {we.weight_used && <span>@ {we.weight_used} kg</span>}
                        {we.duration    && <span>{we.duration}s</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditWe(we)} className="text-xs text-blue-600 hover:underline">Modifier</button>
                      <button onClick={() => handleRemoveEx(we.we_id)} className="text-xs text-red-500 hover:underline">Retirer</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ajout d'exercice */}
        {addingEx && (
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Choisir un exercice --</option>
              {(exData?.exercises ?? []).map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
              ))}
            </select>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'sets',        label: 'Séries' },
                { key: 'reps',        label: 'Reps' },
                { key: 'weight_used', label: 'Poids (kg)' },
                { key: 'duration',    label: 'Durée (s)' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input type="number" value={(exForm as any)[key]}
                    onChange={e => setExForm({ ...exForm, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAddingEx(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={handleAddExercise} disabled={saving || !selectedEx}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-60">
                {saving ? '...' : 'Ajouter'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
