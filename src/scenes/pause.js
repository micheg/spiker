import "phaser";

export default class PuaseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }

  create_button(y, text, key, fn) {
    const { width, height } = this.sys.game.canvas;

    const btn_rect = this.add
      .rectangle(width / 2, y, width - 20, 80, 0x454c60, 0.7)
      .setOrigin(0.5);
    const btn_text = this.add
      .text(width / 2, y, text, {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);
    btn_rect.setInteractive().on("pointerdown", () => {
      if (this.pushed[key] === true) return;
      this.pushed[key] === true;
      this.tweens.add({
        targets: [btn_rect, btn_text],
        scale: 0.8,
        duration: 200,
        yoyo: true,
        ease: "Cubic",
        onComplete: () => {
          this.pushed[key] = false;
          fn(this);
        },
      });
    });
    return {
      rect: btn_rect,
      text: btn_text,
    };
  }

  create() {
    const pad_value = 150;
    const { width, height } = this.sys.game.canvas;
    this.r2_pushed === false;
    this.r1_pushed === false;
    this.pushed = {
      resume: false,
      audio: false,
      exit: false,
    };

    const rb = this.add
      .rectangle(width / 2, height / 2, width, height, 0xffffff, 0.4)
      .setOrigin(0.5);

    this.create_button(height / 2 - pad_value, "Resume", "resume", (self) => {
      self.scene.stop();
      self.scene.resume("game");
    });

    const audio_label = this.game.config.info.audio ? "Audio  ON" : "Audio OFF";

    this.audo_btn = this.create_button(
      height / 2,
      audio_label,
      "audio",
      (self) => {
        this.game.config.info.audio = !this.game.config.info.audio;
        const audio_label = this.game.config.info.audio
          ? "Audio  ON"
          : "Audio OFF";
        this.audo_btn.text.text = audio_label;
        const sound = this.sound.get("back");
        if (this.game.config.info.audio) {
          sound.play();
        } else {
          sound.stop();
        }
      },
    );

    this.create_button(height / 2 + pad_value, "Exit", "exit", (self) => {
      self.scene.stop();
      self.scene.stop("game");
      self.scene.run("menu");
    });
  }
}
