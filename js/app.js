'use strict';

import PopUp from './_popup.js';

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

const backgroundSound = new Audio('./assets/audio/bg.mp3');
const alertSound = new Audio('./assets/audio/alert.wav');
const bugSound = new Audio('./assets/audio/bug_pull.mp3');
const carrotSound = new Audio('./assets/audio/carrot_pull.mp3');
const winSound = new Audio('./assets/audio/game_win.mp3');

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
    playSound(carrotSound);
    field.removeChild(target);

    if (score === 0) {
      stopGame(message.win);
      playSound(winSound);
    }
  }

  if (bug) {
    stopGame(message.lose);
    playSound(bugSound);
  }
}

gamePlayBtn.addEventListener('click', startGame);

gameStopBtn.addEventListener('click', () => {
  stopGame(message.replay);
  playSound(alertSound);
});

function startGame() {
  initGame();
  showContorlHideDesc();
  startGameTimer();
  playSound(backgroundSound);

  started = true;
}

function stopGame(message) {
  stopGameTimer();
  stopSound(backgroundSound);
  hideGameStopBtn();
  gameFinishBanner.showWithText(message);

  started = false;
}

function refreshGame() {
  updateTimerText(GAME_DURATION_SEC);
  showGameStopBtn();
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
  sound.currentTime = 0;
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
      playSound(bugSound);
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
