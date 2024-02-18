import BaseUIScene from "./base_ui";
import { can_play, padTo8 } from "../helpers/utils";

class MenuScene extends BaseUIScene {
  constructor() {
    super("menu");
  }

  playBGMusic() {
    if (can_play(this) && this.bg_sound.isPlaying) return;
    if (can_play(this) && !this.bg_sound.isPlaying) this.bg_sound.play();
    if (!can_play(this) && !this.bg_sound.isPlaying) return;
    if (!can_play(this) && this.bg_sound.isPlaying) this.bg_sound.stop();
  }

  createLastScore(data) {
    if (data && data.score) {
      const { width, height } = this.sys.game.canvas;
      const center = {
        x: width / 2,
        y: height / 2,
      };
      const text = `last score ${padTo8(data.score)}`;
      this.add
        .text(center.x, center.y + 300, text, {
          fontFamily: "monospace",
          fontSize: 30,
          color: "#FFFFFF",
        })
        .setOrigin(0.5);
    }
  }

  create(data) {
    this.sound.removeByKey("back");
    this.bg_sound = this.sound.add("back", { volume: 0.1, loop: true });
    this.playBGMusic();

    const { width, height } = this.sys.game.canvas;
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    const center = this.center;
    const rect = this.add
      .rectangle(center.x, center.y, width, height, 0x454c60)
      .setOrigin(0.5);

    this.createSpikeButton("Start Game!", center.y - 250, () => {
      this.scene.stop();
      if (sessionStorage.getItem("tutorial") === null) {
        this.scene.run("tutorial", { next: "game" });
        sessionStorage.setItem("tutorial", true);
      } else {
        this.scene.run("game");
      }
    });

    this.createSpikeButton("Tutorial!", center.y + 200, () => {
      this.scene.stop();
      this.scene.run("tutorial", { next: "menu" });
    });

    this.createSpikeButton("Scores!", center.y - 100, () => {
      this.scene.stop();
      this.scene.run("score");
    });
    const audio_label = this.game.config.info.audio ? "Audio  ON" : "Audio OFF";

    this.audio_btn = this.createSpikeButton(audio_label, center.y + 50, () => {
      this.game.config.info.audio = !this.game.config.info.audio;
      const audio_label = this.game.config.info.audio
        ? "Audio  ON"
        : "Audio OFF";
      this.audio_btn.text = this._pad(audio_label);
      this.playBGMusic();
    });
    this.createLastScore(data);
    this.spikes = this.createSpikes();
    this.createLogo();
  }
}

export default MenuScene;
