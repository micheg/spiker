import { can_play } from "../helpers/utils";

const SPIKE_VELOCITY = 200;
const PLAER_VELOCITY = 300;

import "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game");
  }
  init() {
    this.totalTime = 0;
    this.food = false;
    this.JUMP = PLAER_VELOCITY;
    this.score = 0;
    this.state = "PLAY";
    this.dead_from = null;
  }

  play(sound) {
    if (can_play(this)) this[sound].play();
  }

  createAudio() {
    this.hit = this.sound.add("hit");
    this.pick = this.sound.add("pick");
    this.jump = this.sound.add("jump");
  }

  createPlayer() {
    const { width, height } = this.sys.game.canvas;
    this.anims.create({
      key: "fly",
      frameRate: 8,
      frames: this.anims.generateFrameNames("texture", {
        prefix: "ape",
        suffix: ".png",
        start: 1,
        end: 2,
      }),
      repeat: -1,
    });

    const player = this.physics.add
      .sprite(width * 0.1, height / 2, "texture", "ape1.png")
      .setOrigin(0.5)
      .setScale(1.5)
      .play("fly");
    player.body.velocity.x = PLAER_VELOCITY;
    player.body.gravity.y = PLAER_VELOCITY + 100;
    return player;
  }

  create() {
    this.createAudio();
    const { width, height } = this.sys.game.canvas;

    this.width = width;
    this.height = height;
    this.add.image(width / 2, height / 2, "texture", "sky.png");

    const player = this.createPlayer();
    this.player = player;

    const spike_up = this.physics.add
      .image(width / 2, height - 50, "texture", "spike_wall.png")
      .setOrigin(0.5, 0)
      .setImmovable(true);
    spike_up.body.velocity.y = -SPIKE_VELOCITY / 5;
    this.spike_up = spike_up;

    const spike_dwn = this.physics.add
      .image(width / 2, 50, "texture", "spike_wall.png")
      .setOrigin(0.5, 1)
      .setImmovable(true);
    spike_dwn.flipY = true;
    spike_dwn.body.velocity.y = SPIKE_VELOCITY / 5;
    this.spike_dwn = spike_dwn;

    this.input.on("pointerdown", (evt) => {
      player.body.velocity.y = -this.JUMP;
      this.play("jump");
    });
    this.input.keyboard.on("keydown-SPACE", (evt) => {
      player.body.velocity.y = -this.JUMP;
      this.play("jump");
    });

    this.physics.add.collider(player, spike_up, this.restartFromUP, null, this);
    this.physics.add.collider(
      player,
      spike_dwn,
      this.restartFromDown,
      null,
      this,
    );
    const emitter = this.add.particles(0, 30, "texture", {
      frame: "red.png",
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });
    emitter.startFollow(player);
    this.emitter = emitter;
    this.createUI();
  }

  createUI() {
    const { width, height } = this.sys.game.canvas;
    this.scoreTxt = this.add
      .text(width / 2, 50, "Score: 0", {
        fontFamily: "monospace",
        fontSize: 32,
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    this.pause = this.add
      .sprite(width - 50, 50, "texture", "pause.png")
      .setScale(3)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.pause_click === true) return;
        this.pause_click === true;
        this.tweens.add({
          targets: this.pause,
          scale: 4,
          duration: 100,
          yoyo: true,
          ease: "Cubic",
          onComplete: () => {
            this.pause_click === false;
            console.log("complete, pause is " + this.scene.isPaused);
            if (!this.scene.isPaused()) {
              this.scene.launch("pause");
              this.scene.pause();
            }
          },
        });
      });
  }

  stopGameObjs() {
    this.emitter.stop();
    this.spike_dwn.body.velocity.y = 0;
    this.spike_up.body.velocity.y = 0;
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
  }

  restartFromUP() {
    this.dead_from = "UP";
    this.restart();
  }

  restartFromDown() {
    this.dead_from = "DOWN";
    this.restart();
  }

  restart() {
    this.play("hit");
    const { width, height } = this.sys.game.canvas;
    this.state = "END";
    this.stopGameObjs();
    const target_h = this.dead_from === "UP" ? -20 : height + 20;
    this.tweens.add({
      targets: this.player,
      scale: 3,
      y: target_h,
      rotation: 360,
      duration: 600,
      ease: "Cubic",
      yoyo: true,
      onComplete: () => {
        this.saveScore();
        this.scene.stop();
        this.scene.run("menu", { score: this.score });
      },
    });
  }

  saveScore() {
    let tmp = JSON.parse(sessionStorage.scores || JSON.stringify([]));
    tmp.push(this.score);
    tmp.sort((a, b) => b - a).slice(0, 10);
    sessionStorage.scores = JSON.stringify(tmp);
  }

  updateScore() {
    this.scoreTxt.text = `Score: ${this.score}`;
  }

  createFood() {
    if (this.food) return;
    this.food = true;
    const { width, height } = this.sys.game.canvas;
    const center = height / 2;
    const x_delta = 70;
    let x =
      this.player.x > width / 2
        ? Phaser.Math.Between(x_delta, width / 2)
        : Phaser.Math.Between(width / 2, width - x_delta);

    const fortune = Phaser.Math.Between(1, 10);
    this.food_texture = fortune > 7 ? "r_star.png" : "b_star.png";

    const delta = (this.spike_up.y - this.spike_dwn.y - 50) / 2;
    const y = Phaser.Math.Between(center - delta, center + delta);
    const star = this.physics.add
      .image(x, y, "texture", this.food_texture)
      .setImmovable(true);
    star.setScale(2);
    //star.body.update();
    this.physics.add.overlap(
      this.player,
      star,
      function () {
        if (this.state === "END") return;
        this.play("pick");
        star.body.enable = false;
        this.tweens.add({
          targets: star,
          scale: 1.5,
          duration: 50,
          y: y - 50,
          yoyo: true,
          ease: "Cubic",
          onComplete: () => {
            this.JUMP += 5;
            this.score += this.food_texture === "r_star.png" ? 10 : 5;
            this.food = false;

            star.destroy();
            this.updateScore();
            const _jump = this.food_texture === "r_star.png" ? 100 : 50;

            const max_up = Math.min(this.spike_up.y + _jump, height - 50);
            const max_dw = Math.max(this.spike_dwn.y - _jump, 50);
            this.spike_up.setPosition(width / 2, max_up);
            this.spike_dwn.setPosition(width / 2, max_dw);
          },
        });
      },
      null,
      this,
    );
    this.physics.add.overlap(
      star,
      this.spike_up,
      function () {
        this.play("hit");
        this.food = false;
        this.score -= 2;
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
        this.play("hit");
        this.food = false;
        this.score -= 2;
        star.destroy();
        this.updateScore();
      },
      null,
      this,
    );
  }

  update(time, delta) {
    if (this.state !== "PLAY") return;
    if (this.player.body.velocity.x > 0) {
      this.player.flipX = false;
      this.emitter.followOffset.x = -35;
      this.emitter.followOffset.y = -15;
    } else {
      this.player.flipX = true;
      this.emitter.followOffset.x = 35;
      this.emitter.followOffset.y = -15;
    }
    this.totalTime += delta;
    if (this.totalTime > 600) {
      this.totalTime = 0;
      this.createFood();
    }
    const { player, width, height } = this;
    if (player.x > width - player.width) {
      player.body.velocity.x = -PLAER_VELOCITY;
    } else if (player.x < player.width) {
      player.body.velocity.x = PLAER_VELOCITY;
    }
  }
}
