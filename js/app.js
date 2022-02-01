'use strict';

import PopUp from './_popup.js';
import * as sound from './_sound.js';
import Field from './_field.js';

const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const gamePlayBtn = document.querySelector('.game-btn[data-id="play"]');
const gameDesc = document.querySelector('.game-desc');
const gameControl = document.querySelector('.game-control');

const gameStopBtn = document.querySelector('.game-btn[data-id="stop"]');
const gameTimer = document.querySelector('.game-timer');
const gameScore = document.querySelector('.game-score');

let score = null;
let countdown = null;
let started = false;

const message = {
  win: '<i aria-hidden="true">🥕🥕🥕</i> YEAH! YOU WIN! <i aria-hidden="true">💪😎🔥</i>',
  lose: '<i aria-hidden="true">🐛🐛🐛</i> YOU LOSE <i aria-hidden="true">🥲 💦</i>',
  timeover:
    '<i aria-hidden="true">⏰</i> Time Over <i aria-hidden="true">⏰</i>',
  replay: '<i aria-hidden="true">♻️</i> Replay?',
};

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  refreshGame();
  startGame();
});

const field = new Field(CARROT_COUNT, BUG_COUNT);
field.setClickListener(onFieldClick);

function onFieldClick(item) {
  if (!started) return;

  if (item === 'carrot') {
    updateScoreBoard(--score);

    if (score === 0) {
      stopGame(message.win);
      sound.playWin();
    }
  }

  if (item === 'bug') {
    stopGame(message.lose);
  }
}

gamePlayBtn.addEventListener('click', startGame);

gameStopBtn.addEventListener('click', () => {
  stopGame(message.replay);
  sound.playAlert();
});

function startGame() {
  started = true;
  initGame();
  showContorlHideDesc();
  startGameTimer();
  sound.playBgm();
}

function stopGame(message) {
  started = false;
  gameFinishBanner.showWithText(message);
  sound.stopBgm();
  stopGameTimer();
  hideGameStopBtn();
}

function refreshGame() {
  updateTimerText(GAME_DURATION_SEC);
  showGameStopBtn();
}

function showContorlHideDesc() {
  gameDesc.classList.remove('is-active');
  gameControl.classList.add('is-active');
}

function hideGameStopBtn() {
  gameStopBtn.classList.remove('is-active');
}

function showGameStopBtn() {
  gameStopBtn.classList.add('is-active');
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);

  countdown = setInterval(() => {
    if (remainingTimeSec === 0) {
      stopGame(message.timeover);
      sound.playBug();
      return;
    }

    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(countdown);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const printMin = min < 10 ? '0' + min : min;

  const sec = time % 60;
  const printSec = sec < 10 ? '0' + sec : sec;

  gameTimer.textContent = `${printMin}:${printSec}`;
}

function updateScoreBoard(score) {
  gameScore.textContent = score;
}

function initGame() {
  score = CARROT_COUNT;
  gameScore.textContent = CARROT_COUNT;

  field.init();
}
