import { Scene } from "phaser";

class TutScene extends Scene {
  constructor() {
    super("tutorial");
  }

  create_spike() {
    const { width, height } = this.sys.game.canvas;
    const spike_up = this.add
      .image(width / 2, height - 50, "texture", "spike.png")
      .setOrigin(0.5, 0);

    const spike_dwn = this.add
      .image(width / 2, 150, "texture", "spike.png")
      .setOrigin(0.5, 1);
    spike_dwn.flipY = true;
    return {
      top: spike_dwn,
      bottom: spike_up,
    };
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const center = {
      x: width / 2,
      y: height / 2,
    };
    const rect = this.add
      .rectangle(center.x, center.y, width, height, 0x454c60)
      .setOrigin(0.5);
    const text = `👆 to jump, \n\ncollect ⭐ to \n\nslowdown 🔺🔺🔺🔺, \n\ntry to survie.`;
    this.add
      .text(center.x, center.y - 100, text, {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    const tap = this.add
      .text(center.x, height - 200, "tap to star", {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5, 0.5)
      .setAlpha(0.8);

    this.tweens.add({
      targets: tap,
      alpha: 1,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "linear",
    });

    this.spikes = this.create_spike();

    const logo = this.add
      .text(center.x, 60, "SPIKER", {
        fontFamily: "monospace",
        fontSize: 70,
        color: "#FFFFFF",
      })
      .setOrigin(0.5)
      .setAlpha(0.2);

    this.tweens.add({
      targets: logo,
      alpha: 1,
      scale: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Cubic",
    });

    this.input.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.spikes.top, this.spikes.bottom],
        y: center.y,
        duration: 600,
        yoyo: true,
        ease: "Cubic",
        onComplete: () => {
          this.scene.stop();
          this.scene.run("game");
        },
      });
    });
  }
}

export default TutScene;
