import { WORLDS } from "../data/worlds";
import { playSound } from "../utils/sounds";

export default function WorldSelect({ onSelectWorld, onBack }) {
  const selectWorld = (world) => {
    playSound("worldSelect");
    onSelectWorld(world);
  };

  const goBack = () => {
    playSound("back");
    onBack();
  };

  return (
    <main className="screen screen-worlds">
      <div className="scanlines" />
      <div className="stars"></div>
      
      <section className="world-header">
        <p className="eyebrow">🌍 ELIGE TU REINO 🌍</p>
        <h1 className="screen-title">⚔️ MUNDOS DE BATALLA ⚔️</h1>
      </section>

      <section className="world-grid">
        {WORLDS.map((world) => (
          <button
            className="world-card gamer-card"
            key={world.id}
            style={{ "--world-color": world.color }}
            type="button"
            onClick={() => selectWorld(world)}
          >
            <span className="world-number">#{world.id}</span>
            <div className="world-orb-container">
              <span className="world-orb" />
            </div>
            <strong className="world-name">{world.name}</strong>
            <span className="world-action">⚔️ ENTRAR ⚔️</span>
          </button>
        ))}
      </section>

      <button className="ghost-button back-button" type="button" onClick={goBack}>
        ⬅️ VOLVER ⬅️
      </button>
    </main>
  );
}
