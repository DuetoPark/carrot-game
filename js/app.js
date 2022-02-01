'use strict';

import PopUp from './_popup.js';
import * as sound from './_sound.js';

const CARROT_SIZE = 100;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game-field');
const fieldRect = field.getBoundingClientRect();

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

field.addEventListener('click', onFieldClick);

function onFieldClick(event) {
  if (!started) return;

  const target = event.target;
  const carrot = target.matches('.carrot-btn');
  const bug = target.matches('.bug-btn');

  if (carrot) {
    updateScoreBoard(--score);
    sound.playCarrot();
    field.removeChild(target);

    if (score === 0) {
      stopGame(message.win);
      sound.playWin();
    }
  }

  if (bug) {
    stopGame(message.lose);
    sound.playBug();
  }
}

gamePlayBtn.addEventListener('click', startGame);

gameStopBtn.addEventListener('click', () => {
  stopGame(message.replay);
  layAlert();
});

function startGame() {
  initGame();
  showContorlHideDesc();
  startGameTimer();
  sound.playBgm();

  started = true;
}

function stopGame(message) {
  stopGameTimer();
  sound.stopBgm();
  hideGameStopBtn();
  gameFinishBanner.showWithText(message);

  started = false;
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

  field.innerHTML = '';

  gameScore.textContent = CARROT_COUNT;

  addItem('carrot', CARROT_COUNT, 'carrot.png');
  addItem('bug', BUG_COUNT, 'bug.png');
}

function addItem(className, count, imgName) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const alt = className === 'carrot' ? '당근' : '벌레';

    const btn = document.createElement('btn');
    btn.setAttribute('class', `${className}-btn`);
    btn.setAttribute('type', 'button');
    btn.innerHTML = `<img src="./assets/images/${imgName}" alt="${alt}" />`;
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    field.appendChild(btn);
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
