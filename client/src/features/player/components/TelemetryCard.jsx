export function TelemetryCard({ bitrate = '35 Mbps', latency = '18 ms' }) {
  return (
    <div data-testid="telemetry-card">
      <p>Бітрейт: {bitrate}</p>
      <p>Пінг: {latency}</p>
    </div>
  );
}

export default TelemetryCard;
