'use strict';

import { Field, ItemType } from './_field.js';
import * as sound from './_sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  replay: 'replay',
  timeover: 'timeover',
});

// NOTE: Builder Pattern
export class GameBuilder {
  setCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  setBugCount(num) {
    this.bugCount = num;
    return this;
  }

  setGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  build() {
    return new Game(
      this.carrotCount, //
      this.bugCount, //
      this.gameDuration //
    );
  }
}

class Game {
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
      this.stop(Reason.replay);
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

    if (item === ItemType.carrot) {
      this.updateScoreBoard(--this.score);

      if (this.score === 0) {
        this.stop(Reason.win);
      }
    }

    if (item === ItemType.bug) {
      this.stop(Reason.lose);
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
        this.stop(Reason.timeover);
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
