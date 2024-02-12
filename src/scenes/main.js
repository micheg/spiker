/**
 * @format
 */

const VELOCITY = 300;

import "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
  }
  init() {
    this.totalTime = 0;
    this.food = false;
    this.JUMP = VELOCITY;
    this.score = 0;
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    this.width = width;
    this.height = height;
    this.add.image(width / 2, height / 2, "texture", "sky.png");

    const bird = this.physics.add
      .image(width * 0.1, height / 2, "texture", "bird.png")
      .setOrigin(0.5);
    bird.flipX = true;
    bird.body.velocity.x = VELOCITY;
    bird.body.gravity.y = VELOCITY + 100;
    this.bird = bird;
    const spike_up = this.physics.add
      .image(width / 2, height - 50, "texture", "spike.png")
      .setOrigin(0.5, 0)
      .setImmovable(true);
    spike_up.body.velocity.y = -VELOCITY / 5;
    this.spike_up = spike_up;

    const spike_dwn = this.physics.add
      .image(width / 2, 50, "texture", "spike.png")
      .setOrigin(0.5, 1)
      .setImmovable(true);
    spike_dwn.flipY = true;
    spike_dwn.body.velocity.y = VELOCITY / 5;
    this.spike_dwn = spike_dwn;

    this.input.on("pointerdown", (evt) => {
      bird.body.velocity.y = -this.JUMP;
    });
    this.input.keyboard.on("keydown-SPACE", (evt) => {
      bird.body.velocity.y = -this.JUMP;
    });

    this.physics.add.collider(bird, spike_up, this.restart, null, this);
    this.physics.add.collider(bird, spike_dwn, this.restart, null, this);

    this.scoreTxt = this.add
      .text(width / 2, 50, "Score: 0", {
        fontFamily: "monospace",
        fontSize: 32,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    const emitter = this.add.particles(0, 30, "texture", {
      frame: "red.png",
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });
    emitter.startFollow(bird);
  }

  restart() {
    this.scene.restart();
  }

  updateScore() {
    this.scoreTxt.text = `Score: ${this.score}`;
  }

  createFood() {
    if (this.food) return;
    this.food = true;
    const { width, height } = this.sys.game.canvas;
    const center = height / 2;
    let x =
      this.bird.x > width / 2
        ? Phaser.Math.Between(50, width / 2)
        : Phaser.Math.Between(width / 2, 530);

    //const x = Phaser.Math.Between(50, 530);
    const delta = (this.spike_up.y - this.spike_dwn.y - 50) / 2;
    const y = Phaser.Math.Between(center - delta, center + delta);
    const star = this.physics.add
      .image(x, y, "texture", "r_star.png")
      .setImmovable(true);
    star.setScale(2);
    //star.body.update();
    this.physics.add.overlap(
      this.bird,
      star,
      function () {
        this.food = false;
        this.JUMP += 5;
        this.score += 5;
        star.destroy();
        this.updateScore();
        const max_up = Math.min(this.spike_up.y + 100, height - 50);
        const max_dw = Math.max(this.spike_dwn.y - 100, 50);
        this.spike_up.setPosition(width / 2, max_up);
        this.spike_dwn.setPosition(width / 2, max_dw);
      },
      null,
      this,
    );
    this.physics.add.overlap(
      star,
      this.spike_up,
      function () {
        this.food = false;
        this.score -= 5;
        star.destroy();
        this.updateScore();
      },
      null,
      this,
    );
    this.physics.add.overlap(
      star,
      this.spike_dwn,
      function () {
        this.food = false;
        this.score -= 5;
        star.destroy();
        this.updateScore();
      },
      null,
      this,
    );
  }

  update(time, delta) {
    if (this.bird.body.velocity.x > 0) this.bird.flipX = true;
    this.totalTime += delta;
    if (this.totalTime > 600) {
      this.totalTime = 0;
      this.createFood();
    }
    const { bird, width, height } = this;
    if (bird.x > width - bird.width) {
      bird.body.velocity.x = -VELOCITY;
    } else if (bird.x < bird.width) {
      bird.body.velocity.x = VELOCITY;
    }
  }
}
