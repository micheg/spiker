import BaseUIScene from "./base_ui";
import { can_play } from "../helpers/utils";

class MenuScene extends BaseUIScene {
  constructor() {
    super("menu");
  }

  play_bg() {
    if (this.bg_sound.isPlaying) return;
    if (can_play(this) === false) return;
    this.bg_sound.play();
  }

  create() {
    this.sound.removeByKey("back");
    this.bg_sound = this.sound.add("back", { volume: 0.3, loop: true });
    this.play_bg();

    const { width, height } = this.sys.game.canvas;
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    const center = this.center;
    const rect = this.add
      .rectangle(center.x, center.y, width, height, 0x454c60)
      .setOrigin(0.5);

    this.create_btn("Start Game!", center.y - 200, () => {
      this.scene.stop();
      if (sessionStorage.getItem("tutorial") === null) {
        this.scene.run("tutorial");
        sessionStorage.setItem("tutorial", true);
      } else {
        this.scene.run("game");
      }
    });

    this.create_btn("Scores!", center.y, () => {
      this.scene.stop();
      this.scene.run("score");
    });
    const audio_label = this.game.config.info.audio ? "Audio  ON" : "Audio OFF";

    this.audio_btn = this.create_btn(audio_label, center.y + 200, () => {
      this.game.config.info.audio = !this.game.config.info.audio;
      const audio_label = this.game.config.info.audio
        ? "Audio  ON"
        : "Audio OFF";
      this.audio_btn.text = this._pad(audio_label);
      this.play_bg();
    });

    this.spikes = this.create_spike();
    this.create_logo();
  }
}

export default MenuScene;
