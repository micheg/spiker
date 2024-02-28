/**
 * @format
 */

import "phaser";
import GameScene from "./scenes/game";
import BootScene from "./scenes/boot";
import MenuScene from "./scenes/menu";
import ScoreScene from "./scenes/scores";
import TutScene from "./scenes/tutorial";
import PuaseScene from "./scenes/pause";
import { Capacitor } from "@capacitor/core";
import { isMobile } from "./helpers/utils";

const game_area = {
  h: 1031,
  w: 580,
};

let game = null;
let init = false;

let config = {
  type: Phaser.AUTO,
  //  backgroundColor: "#ffffff",
  transparent: true,
  scale: {
    parent: "game",
    mode: Phaser.Scale.FIT,
    width: 580,
    height: 1031,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene, ScoreScene, TutScene, PuaseScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

window.addEventListener("load", () => {
  if (Capacitor.isNativePlatform()) {
    try {
      window.screen.orientation.lock("portrait");
      StatusBar.hide();
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("web?");
  }

  if (window.innerWidth < window.innerHeight) {
    const ratio = window.innerHeight / window.innerWidth;
    const width = 580;
    const height = Math.min(width * ratio, 1392);
    config.scale.width = width;
    config.scale.height = height;
    init = true;
  }
  game = new Phaser.Game(config);
  game.config.info = {
    game_area: game_area,
    audio: false,
  };
});

window.addEventListener("resize", () => {
  if (!isMobile()) return;
  if (game === null) exit();
  if (window.innerWidth < window.innerHeight) {
    if (init == false) window.location.reload();
    if (game.isPaused) {
      game.resume();
      const g_elem = document.getElementById("game");
      g_elem.style.display = "block";
      const r_elem = document.getElementById("rotate");
      r_elem.style.display = "none";
    }
  } else {
    if (game != null) {
      game.pause();
      const g_elem = document.getElementById("game");
      g_elem.style.display = "none";
      const r_elem = document.getElementById("rotate");
      r_elem.style.display = "flex";
    }
  }
});
