import { useParams } from 'react-router-dom';
import { PlayerHud } from '../features/player/components/PlayerHud';
import { TelemetryCard } from '../features/player/components/TelemetryCard';

export function PlayerPage() {
  const { id } = useParams();

  return (
    <section data-testid="player-page">
      <h1>Відеоплеєр: {id}</h1>
      <PlayerHud title={id} />
      <TelemetryCard />
    </section>
  );
}

export default PlayerPage;
