import { useEffect, useRef } from "react";
import Phaser from "phaser";

import MainScene from "./MainScene";
import { playSound } from "../utils/sounds";

export default function GameCanvas({ world, onBack }) {
  const gameRef = useRef(null);

  const goBack = () => {
    playSound("back");
    onBack();
  };

  useEffect(() => {
    if (!gameRef.current) {
      return undefined;
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: world?.color ?? "#000000",
      scene: []
    });

    game.scene.add("MainScene", MainScene, true, { world });

    return () => {
      game.destroy(true);
    };
  }, [world]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <button
        type="button"
        onClick={goBack}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 999,
          padding: "10px 14px",
          borderRadius: 6,
          border: "1px solid rgba(0,0,0,0.2)",
          cursor: "pointer"
        }}
      >
        Volver
      </button>

      <div
        ref={gameRef}
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden"
        }}
      />
    </div>
  );
}
