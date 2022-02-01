'use strict';

const audio = {
  bgm: new Audio('./assets/audio/bg.mp3'),
  alert: new Audio('./assets/audio/alert.wav'),
  bug: new Audio('./assets/audio/bug_pull.mp3'),
  carrot: new Audio('./assets/audio/carrot_pull.mp3'),
  win: new Audio('./assets/audio/game_win.mp3'),
};

export function playBgm() {
  playSound(audio.bgm);
}

export function playAlert() {
  playSound(audio.alert);
}

export function playBug() {
  playSound(audio.bug);
}

export function playCarrot() {
  playSound(audio.carrot);
}

export function playWin() {
  playSound(audio.win);
}

export function stopBgm() {
  stopSound(audio.bgm);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
  sound.currentTime = 0;
}
