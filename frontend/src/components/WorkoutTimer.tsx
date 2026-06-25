import { useEffect, useRef, useState } from 'react';

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// Bip généré via la Web Audio API, sans fichier audio à charger
const playBeep = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain        = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = 880;
  gain.gain.value = 0.2;
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.3);
  oscillator.onended = () => ctx.close();
};

const notifyRestOver = () => {
  playBeep();
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('FitTrack', { body: 'Fin du temps de repos !' });
  }
};

const REST_PRESETS = [30, 60, 90, 120];

export default function WorkoutTimer() {
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [restLeft, setRestLeft] = useState<number | null>(null);

  const elapsedInterval = useRef<number | null>(null);
  const restInterval     = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (running) {
      elapsedInterval.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
    } else if (elapsedInterval.current) {
      clearInterval(elapsedInterval.current);
    }
    return () => { if (elapsedInterval.current) clearInterval(elapsedInterval.current); };
  }, [running]);

  useEffect(() => {
    if (restLeft === null) return;
    if (restLeft <= 0) {
      notifyRestOver();
      setRestLeft(null);
      return;
    }
    restInterval.current = window.setTimeout(() => setRestLeft(r => (r ?? 1) - 1), 1000);
    return () => { if (restInterval.current) clearTimeout(restInterval.current); };
  }, [restLeft]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6">
      <div>
        <p className="text-xs text-gray-400 mb-1">Durée de la séance</p>
        <p className="text-3xl font-bold text-gray-800 tabular-nums">{formatTime(elapsed)}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setRunning(r => !r)}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
          >
            {running ? 'Pause' : elapsed > 0 ? 'Reprendre' : 'Démarrer'}
          </button>
          <button
            onClick={() => { setRunning(false); setElapsed(0); }}
            className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-1">Timer de repos</p>
        {restLeft !== null ? (
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-blue-600 tabular-nums">{formatTime(restLeft)}</p>
            <button
              onClick={() => setRestLeft(null)}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            {REST_PRESETS.map(s => (
              <button
                key={s}
                onClick={() => setRestLeft(s)}
                className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                {s}s
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
