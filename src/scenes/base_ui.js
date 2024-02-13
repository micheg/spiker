import { Scene } from "phaser";

class BaseUIScene extends Scene {
  _pad(str) {
    let tmp = "";
    const len = parseInt((12 - str.length) / 2, 10);
    for (let i = 0; i < len; i++) {
      tmp += " ";
    }
    return ":: " + tmp + str + tmp + " ::";
  }

  // creating top and down spikes
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

  // creating href
  create_btn(text, y, callback) {
    const { width, height } = this.sys.game.canvas;
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    const center = this.center;
    const _text = this._pad(text);
    const button = this.add
      .text(center.x, y, _text, {
        fontFamily: "monospace",
        fontSize: 50,
        color: "#FFFFFF",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.tweens.add({
          targets: [this.spikes.top, this.spikes.bottom],
          y: y,
          duration: 600,
          yoyo: true,
          ease: "Cubic",
          onComplete: () => {
            callback();
          },
        });
      });
    return button;
  }

  // creating logo
  create_logo() {
    const { width, height } = this.sys.game.canvas;
    const center = {
      x: width / 2,
      y: height / 2,
    };

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
  }
}

export default BaseUIScene;
