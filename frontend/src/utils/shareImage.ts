import { Stats } from '../types';

// Génère une image de bilan (carte façon "récap" réseaux sociaux) via Canvas
export const generateShareImage = (username: string, stats: Stats): string => {
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1e3a8a');
  gradient.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('FitTrack', canvas.width / 2, 140);

  ctx.font = '32px sans-serif';
  ctx.fillText(`Bilan de ${username}`, canvas.width / 2, 200);

  const metrics: [string, string][] = [
    [String(stats.total_workouts), 'séances'],
    [String(stats.total_duration), 'minutes'],
    [String(stats.streak), 'jours de suite 🔥'],
  ];

  const startY = 380;
  metrics.forEach(([value, label], i) => {
    const y = startY + i * 220;
    ctx.font = 'bold 120px sans-serif';
    ctx.fillText(value, canvas.width / 2, y);
    ctx.font = '36px sans-serif';
    ctx.fillText(label, canvas.width / 2, y + 60);
  });

  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(new Date().toLocaleDateString('fr-FR'), canvas.width / 2, canvas.height - 60);

  return canvas.toDataURL('image/png');
};

export const downloadShareImage = (username: string, stats: Stats) => {
  const dataUrl = generateShareImage(username, stats);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'fittrack_bilan.png';
  link.click();
};
