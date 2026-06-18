let audioContext;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function tone(frequency, start, duration, type = "square", gain = 0.035) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const volume = context.createGain();
  const now = context.currentTime + start;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function playSound(name) {
  const patterns = {
    menuClick: [
      [440, 0, 0.06],
      [550, 0.06, 0.06],
      [660, 0.12, 0.08]
    ],
    gameStart: [
      [262, 0, 0.1],
      [330, 0.11, 0.1],
      [392, 0.22, 0.1],
      [523, 0.33, 0.15]
    ],
    worldSelect: [
      [523, 0, 0.08],
      [659, 0.08, 0.08],
      [784, 0.16, 0.12]
    ],
    back: [
      [400, 0, 0.08],
      [300, 0.08, 0.1],
      [200, 0.18, 0.12]
    ],
    foodCollect: [
      [880, 0, 0.05],
      [1000, 0.05, 0.05],
      [1100, 0.1, 0.08]
    ],
    levelUp: [
      [523, 0, 0.08],
      [659, 0.08, 0.08],
      [784, 0.16, 0.08],
      [1047, 0.24, 0.15]
    ],
    damage: [
      [200, 0, 0.05],
      [150, 0.05, 0.05],
      [100, 0.1, 0.08]
    ],
    spiderDeath: [
      [100, 0, 0.1],
      [120, 0.1, 0.1],
      [150, 0.2, 0.15]
    ],
    gameOver: [
      [400, 0, 0.1],
      [300, 0.1, 0.1],
      [200, 0.2, 0.1],
      [100, 0.3, 0.3]
    ],
    victory: [
      [523, 0, 0.08],
      [659, 0.09, 0.08],
      [784, 0.18, 0.08],
      [1047, 0.27, 0.08],
      [784, 0.36, 0.08],
      [659, 0.45, 0.08],
      [1047, 0.54, 0.3]
    ],
    potion: [
      [660, 0, 0.06],
      [784, 0.06, 0.06],
      [988, 0.12, 0.12]
    ]
  };

  (patterns[name] ?? patterns.menuClick).forEach(([frequency, start, duration]) => {
    tone(frequency, start, duration);
  });
}
