import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { Stats } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const GOAL_LABELS: Record<string, string> = {
  lose:     'Perdre du poids',
  maintain: 'Maintenir',
  gain:     'Prendre du muscle',
};

export default function Dashboard() {
  const { user }                  = useAuth();
  const { data, loading, error }  = useFetch<Stats>('/stats');

  if (loading) return <LoadingSpinner />;
  if (error)   return <p className="text-red-500">{error}</p>;

  const chartData = data?.recent_workouts.map(w => ({
    date:     w.date?.slice(0, 10),
    duration: w.duration || 0,
  })) ?? [];

  const pieData = data?.category_breakdown.map(c => ({
    name:  c.category,
    value: c.count,
  })) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bonjour, {user?.username} 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Objectif : {GOAL_LABELS[user?.goal || 'maintain']}
          {user?.weight ? ` · ${user.weight} kg` : ''}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Séances totales',    value: data?.total_workouts,     icon: '📅' },
          { label: 'Minutes d\'entraîn.', value: data?.total_duration,    icon: '⏱️' },
          { label: 'Exercices pratiqués', value: data?.distinct_exercises, icon: '🏋️' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <span className="text-4xl">{icon}</span>
            <div>
              <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Durée des séances (30 derniers jours)</h3>
          {chartData.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Aucune séance ce mois-ci</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} min`, 'Durée']} />
                <Bar dataKey="duration" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Répartition par catégorie</h3>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Aucune donnée</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top exercices */}
      {(data?.top_exercises?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Exercices les plus pratiqués</h3>
          <div className="space-y-3">
            {data!.top_exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{ex.name}</span>
                  <span className="ml-2 text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{ex.category}</span>
                </div>
                <span className="text-blue-600 font-semibold">{ex.count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
