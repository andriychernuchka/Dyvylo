import { useState, useEffect } from 'react';

export function usePlayerTelemetry() {
  const [telemetry, setTelemetry] = useState({
    node: 'KYIV-PECHERSK-01',
    status: 'ONLINE',
    bitrate: 45.4,
    latency: 14,
    fps: 60,
    buffer: 98.4,
    resolution: '3840x2160 (4K UHD)',
    codec: 'AV1 / OPUS 48kHz',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        bitrate: +(45 + (Math.random() * 2 - 1)).toFixed(1),
        latency: Math.floor(12 + Math.random() * 5),
        fps: Math.random() > 0.95 ? 59 : 60,
        buffer: +(97 + Math.random() * 3).toFixed(1),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return telemetry;
}

export default usePlayerTelemetry;
