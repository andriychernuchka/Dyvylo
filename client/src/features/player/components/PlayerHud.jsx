export function PlayerHud({ title = 'Демо' }) {
  return (
    <div data-testid="player-hud">
      <h2>Плеєр: {title}</h2>
      <div>
        <button type="button" data-testid="hud-play-btn">
          Відтворити
        </button>
      </div>
    </div>
  );
}

export default PlayerHud;
