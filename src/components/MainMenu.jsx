import { playSound } from "../utils/sounds";

export default function MainMenu({ onPlay }) {
  const startGame = () => {
    playSound("gameStart");
    onPlay();
  };

  return (
    <main className="screen screen-menu">
      <div className="scanlines" />
      <div className="stars"></div>
      <section className="menu-panel">
        <div className="title-glow">
          <p className="eyebrow">⚔️ COLONIA EN GUERRA ⚔️</p>
          <h1 className="game-title">🐜 HORMIGA QUEST 🐜</h1>
          <div className="glow-effect"></div>
        </div>
        
        <p className="game-subtitle">
          ⚡ RECOLECTA COMIDA • SUBE DE NIVEL • DEFIENDE TU COLONIA ⚡
          <br/>
          🕷️ SOBREVIVE A LAS ARAÑAS ENEMIGAS 🕷️
        </p>

        <div className="menu-actions">
          <button 
            className="primary-button start-button" 
            type="button" 
            onClick={startGame}
          >
            🎮 COMENZAR 🎮
          </button>
          <button 
            className="ghost-button sound-button" 
            type="button" 
            onClick={() => playSound("menuClick")}
          >
            🔊 SONIDO 🔊
          </button>
        </div>

        <div className="menu-footer">
          <p className="version-text">v1.0 - Developed with 🐜 Love</p>
          <div className="ant-animation">
            <span>🐜</span>
            <span>🐜</span>
            <span>🐜</span>
          </div>
        </div>
      </section>
    </main>
  );
}
