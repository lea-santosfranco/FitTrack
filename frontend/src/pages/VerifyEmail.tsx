import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide.');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Erreur lors de la vérification.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">FitTrack</h1>

        {status === 'loading' && <p className="text-gray-500">Vérification en cours...</p>}

        {status === 'success' && (
          <>
            <p className="text-green-600 font-medium">{message}</p>
            <Link to="/login" className="inline-block mt-6 text-blue-600 font-medium hover:underline">
              Se connecter
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-red-600 font-medium">{message}</p>
            <Link to="/login" className="inline-block mt-6 text-blue-600 font-medium hover:underline">
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
