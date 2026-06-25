import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { Program } from '../types';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const LEVEL_COLORS: Record<string, string> = {
  'débutant':      'bg-green-100 text-green-700',
  'intermédiaire': 'bg-amber-100 text-amber-700',
  'avancé':        'bg-red-100 text-red-700',
};

const GOAL_LABELS: Record<string, string> = {
  lose:     'Perdre du poids',
  maintain: 'Maintenir',
  gain:     'Prendre du muscle',
};

export default function Programs() {
  const { data, loading, error } = useFetch<{ programs: Program[] }>('/programs');
  const navigate = useNavigate();
  const [cloning, setCloning] = useState<number | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-red-500">{error}</p>;

  const handleClone = async (programId: number) => {
    setCloning(programId);
    try {
      const res = await api.post(`/programs/${programId}/clone`, {});
      navigate(`/workouts/${res.data.workout_id}`);
    } catch {
      alert('Erreur lors de la copie du programme.');
    } finally {
      setCloning(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Programmes pré-définis</h2>
        <p className="text-gray-500 mt-1">Copiez un programme type dans vos séances pour démarrer rapidement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data?.programs ?? []).map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${LEVEL_COLORS[p.level]}`}>{p.level}</span>
              <span className="text-xs text-gray-400">{GOAL_LABELS[p.goal]}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
            {p.description && <p className="text-sm text-gray-500 mt-2 flex-1">{p.description}</p>}
            <button
              onClick={() => handleClone(p.id)}
              disabled={cloning === p.id}
              className="mt-4 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {cloning === p.id ? 'Copie...' : 'Copier dans mes séances'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
