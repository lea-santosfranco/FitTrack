import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const GOAL_LABELS: Record<string, string> = {
  lose:     'Perdre du poids',
  maintain: 'Maintenir',
  gain:     'Prendre du muscle',
};

export default function Profile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{ username: string; email: string; weight: string; goal: string }>({
    username: user?.username || '',
    email:    user?.email    || '',
    weight:   user?.weight?.toString() || '',
    goal:     user?.goal     || 'maintain',
  });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/profile', {
        ...form,
        weight: form.weight ? parseFloat(form.weight) : undefined,
      });
      const token = localStorage.getItem('fittrack_token') || '';
      login(token, res.data.user);
      setSuccess('Profil mis à jour avec succès.');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Mon profil</h2>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">{success}</div>}
      {error   && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        {editing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
                <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="lose">Perdre du poids</option>
                  <option value="maintain">Maintenir</option>
                  <option value="gain">Prendre du muscle</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </>
        ) : (
          <>
            {[
              { label: 'Nom d\'utilisateur', value: user?.username },
              { label: 'Email',              value: user?.email },
              { label: 'Poids',              value: user?.weight ? `${user.weight} kg` : '—' },
              { label: 'Objectif',           value: GOAL_LABELS[user?.goal || 'maintain'] },
              { label: 'Membre depuis',      value: user?.created_at?.slice(0, 10) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
            <button onClick={() => { setEditing(true); setSuccess(''); setError(''); }}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Modifier le profil
            </button>
          </>
        )}
      </div>
    </div>
  );
}
