function can_play(self) {
  return self.game.config.info.audio;
}

const padTo8 = (number) =>
  number <= 99999999 ? `0000000${number}`.slice(-8) : "OVERKILL";

const isMobile = () => {
  // credit to Timothy Huang for this regex test:
  // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    return true;
  } else {
    return false;
  }
};
export { can_play, padTo8, isMobile };
