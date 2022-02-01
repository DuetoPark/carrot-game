'use strict';

import Field from './_field.js';
import * as sound from './_sound.js';

export default class Game {
  constructor(carrotCount, bugCount, gameDuration) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameDuration = gameDuration;

    this.gameDesc = document.querySelector('.game-desc');
    this.gameControl = document.querySelector('.game-control');
    this.gameTimer = document.querySelector('.game-timer');
    this.gameScore = document.querySelector('.game-score');

    this.gamePlayBtn = document.querySelector('.game-btn[data-id="play"]');
    this.gamePlayBtn.addEventListener('click', this.start);

    this.gameStopBtn = document.querySelector('.game-btn[data-id="stop"]');
    this.gameStopBtn.addEventListener('click', () => {
      this.stop('replay');
      sound.playAlert();
    });

    this.field = new Field(this.carrotCount, this.bugCount);
    this.field.setClickListener(this.onFieldClick);

    this.countdown = null;
    this.score = null;
    this.started = false;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start = () => {
    this.started = true;
    this.init();
    this.showContorlHideDesc();
    this.startGameTimer();
    sound.playBgm();
  };

  stop = (reason) => {
    this.started = false;
    this.stopGameTimer();
    this.hideGameStopBtn();
    sound.stopBgm();
    this.onGameStop && this.onGameStop(reason);
  };

  refresh() {
    this.updateTimerText(this.gameDuration);
    this.showGameStopBtn();
  }

  onFieldClick = (item) => {
    if (!this.started) return;

    if (item === 'carrot') {
      this.updateScoreBoard(--this.score);

      if (this.score === 0) {
        this.stop('win');
        sound.playWin();
      }
    }

    if (item === 'bug') {
      this.stop('lose');
    }
  };

  showContorlHideDesc() {
    this.gameDesc.classList.remove('is-active');
    this.gameControl.classList.add('is-active');
  }

  hideGameStopBtn() {
    this.gameStopBtn.classList.remove('is-active');
  }

  showGameStopBtn() {
    this.gameStopBtn.classList.add('is-active');
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);

    this.countdown = setInterval(() => {
      if (remainingTimeSec === 0) {
        this.stop('timeover');
        sound.playBug();
        return;
      }

      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.countdown);
  }

  updateTimerText(time) {
    const min = Math.floor(time / 60);
    const printMin = min < 10 ? '0' + min : min;

    const sec = time % 60;
    const printSec = sec < 10 ? '0' + sec : sec;

    this.gameTimer.textContent = `${printMin}:${printSec}`;
  }

  updateScoreBoard(score) {
    this.gameScore.textContent = score;
  }

  init() {
    this.score = this.carrotCount;
    this.gameScore.textContent = this.carrotCount;
    this.field.init();
  }
}
