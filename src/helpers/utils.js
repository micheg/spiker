function can_play(self) {
  return self.game.config.info.audio;
}

let padTo8 = (number) =>
  number <= 99999999 ? `0000000${number}`.slice(-8) : "OVERKILL";

export { can_play, padTo8 };
