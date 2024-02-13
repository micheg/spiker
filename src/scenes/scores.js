import { Scene } from "phaser";

function pad(str) {
  let tmp = "";
  const len = parseInt((12 - str.length) / 2, 10);
  for (let i = 0; i < len; i++) {
    tmp += " ";
  }
  return ":: " + tmp + str + tmp + " ::";
}

let padTo8 = (number) =>
  number <= 99999999 ? `0000000${number}`.slice(-8) : "OVERKILL";

class ScoreScene extends Scene {
  constructor() {
    super("score");
  }

  create_btn(text, y, callback) {
    const { width, height } = this.sys.game.canvas;
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    const center = this.center;
    const _text = pad(text);
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
    this.center = {
      x: width / 2,
      y: height / 2,
    };
    const center = this.center;
    //this.add.image(center.x, center.y, "texture", "sky.png");
    const rect = this.add
      .rectangle(center.x, center.y, width, height, 0x454c60)
      .setOrigin(0.5);

    this.create_btn("back", height - 80, () => {
      this.scene.stop();
      this.scene.run("menu");
    });

    const tmp = JSON.parse(sessionStorage.scores || JSON.stringify([]));

    for (let i = 0; i < tmp.length; i++) {
      const y = 150 + (i + 1) * 70;
      this.add
        .text(center.x, y, tmp[i], {
          fontFamily: "monospace",
          fontSize: 50,
          color: "#FFFFFF",
        })
        .setOrigin(0.5);
    }

    this.spikes = this.create_spike();

    this.add
      .text(center.x, 70, "SPIKER", {
        fontFamily: "monospace",
        fontSize: 70,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);
  }
}

export default ScoreScene;
