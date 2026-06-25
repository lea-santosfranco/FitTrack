import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Même règle que côté backend : 8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_HINT  = '8 caractères min., avec majuscule, minuscule, chiffre et caractère spécial.';

export default function Register() {
  const [form,      setForm]      = useState({ username: '', email: '', password: '', weight: '', goal: 'maintain' });
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!PASSWORD_REGEX.test(form.password)) {
      setError(PASSWORD_HINT);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, weight: form.weight ? parseFloat(form.weight) : undefined };
      await api.post('/auth/register', payload);
      setRegistered(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">FitTrack</h1>
          <p className="text-gray-700">
            Compte créé ! Un email de vérification a été envoyé à <strong>{form.email}</strong>.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Cliquez sur le lien reçu pour activer votre compte, puis connectez-vous.
          </p>
          <Link to="/login" className="inline-block mt-6 text-blue-600 font-medium hover:underline">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">FitTrack</h1>
        <p className="text-center text-gray-500 mb-8">Créez votre compte</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <input
              id="username"
              name="username" value={form.username} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              id="password"
              type="password" name="password" value={form.password} onChange={handleChange} required
              pattern={PASSWORD_REGEX.source} title={PASSWORD_HINT}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1">{PASSWORD_HINT}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input
                id="weight"
                type="number" name="weight" value={form.weight} onChange={handleChange} step="0.1" min="30" max="300"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="70"
              />
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
              <select
                id="goal"
                name="goal" value={form.goal} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lose">Perdre du poids</option>
                <option value="maintain">Maintenir</option>
                <option value="gain">Prendre du muscle</option>
              </select>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
