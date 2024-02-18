import BaseUIScene from "./base_ui";
import { padTo8 } from "../helpers/utils";

class ScoreScene extends BaseUIScene {
  constructor() {
    super("score");
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
      const y = 150 + (i + 1) * 50;
      this.add
        .text(center.x, y, this._pad(padTo8(tmp[i])), {
          fontFamily: "monospace",
          fontSize: 36,
          color: "#FFFFFF",
        })
        .setOrigin(0.5);
    }

    this.spikes = this.create_spike();
    this.create_logo();
  }
}

export default ScoreScene;
