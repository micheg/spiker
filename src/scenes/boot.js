import { Scene } from "phaser";

class BootScene extends Scene {
  constructor() {
    super("boot");
  }

  preload() {
    const { width, height } = this.sys.game.canvas;
    const center_x = width / 2;
    const center_y = height / 2;
    this.add
      .text(width / 2, 60, "Spiker...", {
        font: "30px monospace",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5);
    this.loadLabel = this.add.text(width / 2, center_y - 70, "loading\n0%", {
      font: "25px monospace",
      fill: "#fff",
      align: "center",
    });
    this.loadLabel.setOrigin(0.5, 0.5);

    this.add.rectangle(center_x, center_y, width - 20, 60, 0x000000);

    this.progressbar = this.add.rectangle(20, center_y, 0, 40, 0xffffff);
    this.load.audio("back", ["assets/back.ogg", "assets/back.mp3"]);
    this.load.audio("hit", ["assets/hit.wav"]);
    this.load.audio("jump", ["assets/jump.wav"]);
    this.load.audio("pick", ["assets/pick.wav"]);

    this.load.atlas("texture", "assets/texture.png", "assets/texture.json");
    this.load.on("progress", this.progress, this);
    this.load.on(Phaser.Loader.Events.COMPLETE, () => this._next());
  }

  progress(value) {
    const { width, height } = this.sys.game.canvas;
    // Update loading progress
    let percentage = Math.round(value * 100) + "%";
    this.loadLabel.setText("loading\n" + percentage);
    this.progressbar.width = (width - 40) * value;
  }

  _next() {
    this.scene.stop();
    this.scene.start("menu");
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }
}

export default BootScene;
