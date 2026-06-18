import { useState } from "react";

import MainMenu from "./components/MainMenu";
import WorldSelect from "./components/WorldSelect";
import GameCanvas from "./game/GameCanvas";

function App() {

  const [screen, setScreen] = useState("menu");
  const [selectedWorld, setSelectedWorld] = useState(null);

  const goToWorld = (world) => {
    setSelectedWorld(world);
    setScreen("game");
  };

  if (screen === "menu") {
    return (
      <MainMenu
        onPlay={() => setScreen("worlds")}
      />
    );
  }

  if (screen === "worlds") {
    return (
      <WorldSelect
        onSelectWorld={goToWorld}
        onBack={() => setScreen("menu")}
      />
    );
  }

  return (
    <GameCanvas
      world={selectedWorld}
      onBack={() => setScreen("menu")}
    />
  );
}

export default App;