import "phaser";

export default class PuaseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    this.r2_pushed === false;
    this.r1_pushed === false;
    const rect2 = this.add
      .rectangle(width / 2, height / 2 - 100, width - 20, 80, 0x454c60, 0.7)
      .setOrigin(0.5);

    const button_resume = this.add
      .text(width / 2, height / 2 - 100, "Resume", {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    rect2.setInteractive().on("pointerdown", () => {
      if (this.r2_pushed === true) return;
      this.r2_pushed === true;
      this.tweens.add({
        targets: [rect2, button_resume],
        scale: 0.8,
        duration: 200,
        yoyo: true,
        ease: "Cubic",
        onComplete: () => {
          this.r2_pushed === false;
          this.scene.stop();
          this.scene.resume("game");
        },
      });
    });

    const rect1 = this.add
      .rectangle(width / 2, height / 2 + 100, width - 20, 80, 0x454c60, 0.7)
      .setOrigin(0.5);

    const button_exit = this.add
      .text(width / 2, height / 2 + 100, "Exit", {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    rect1.setInteractive().on("pointerdown", () => {
      if (this.r1_pushed === true) return;
      this.r1_pushed === true;
      this.tweens.add({
        targets: [rect1, button_exit],
        scale: 0.8,
        duration: 200,
        yoyo: true,
        ease: "Cubic",
        onComplete: () => {
          this.r1_pushed === false;
          this.scene.stop();
          this.scene.stop("game");
          this.scene.run("menu");
        },
      });
    });
  }
}
