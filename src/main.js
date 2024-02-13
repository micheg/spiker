/**
 * @format
 */

import "phaser";
import GameScene from "./scenes/main";
import BootScene from "./scenes/boot";
import MenuScene from "./scenes/menu";

const game_area = {
  h: 1031,
  w: 580,
};

let config = {
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    width: 580,
    height: 1031,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

window.addEventListener("load", () => {
  if (window.innerWidth < window.innerHeight) {
    const ratio = window.innerHeight / window.innerWidth;
    const width = 580;
    const height = Math.min(width * ratio, 1280);

    console.log(`${ratio} - ${width} - ${height}`);
    config.scale.width = width;
    config.scale.height = height;
  }
  let game = new Phaser.Game(config);
  game.config.info = {
    game_area: game_area,
    audio: false,
  };
});
