import BaseUIScene from "./base_ui";

class TutScene extends BaseUIScene {
  constructor() {
    super("tutorial");
  }

  create(data) {
    const { width, height } = this.sys.game.canvas;
    const next_scene = data && data.next ? data.next : "game";
    const center = {
      x: width / 2,
      y: height / 2,
    };
    const rect = this.add
      .rectangle(center.x, center.y, width, height, 0x454c60)
      .setOrigin(0.5);
    const text = `👆 to jump, \n\ncollect ⭐ to \n\nslowdown 🔺🔺🔺🔺, \n\ntry to survie.`;
    this.add
      .text(center.x, center.y - 80, text, {
        fontFamily: "monospace",
        fontSize: 40,
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

    this.spikes = this.createSpikes();
    this.createLogo();

    this.input.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.spikes.top, this.spikes.bottom],
        y: center.y,
        duration: 600,
        yoyo: true,
        ease: "Cubic",
        onComplete: () => {
          this.scene.stop();
          this.scene.run(next_scene);
        },
      });
    });
  }
}

export default TutScene;
