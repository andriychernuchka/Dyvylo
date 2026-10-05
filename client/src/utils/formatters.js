/**
 * Formatting utility functions
 */

export function formatBitrate(bps) {
  if (!bps) return '0 Mbps';
  const mbps = (bps / (1024 * 1024)).toFixed(1);
  return `${mbps} Mbps`;
}

export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatYear(dateString) {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
}
