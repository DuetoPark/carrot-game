const header = document.querySelector('.game-header');
const gameZone = document.querySelector('.game-zone');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');
const result = document.querySelector('.result');
const init = { time: 10, count: null };
let time = null;
let count = null;
let countdown = null;
let id = null;
const message = {
  win: '🥕🥕🥕 YEAH! YOU WIN! 💪😎🔥',
  lose: '🐛🐛🐛 💦 YOU LOSE 🥲 🐛🐛🐛',
  timeover: '⏰ Time Over ⏰',
};

function onClock() {
  countdown = setInterval(() => {
    time -= 1;

    timer.textContent = `00:${time >= 10 ? time : '0' + time}`;

    if (time === 0) {
      clearInterval(countdown);
      timeover();
    }
  }, 1000);
}

function setBtnLocation() {
  const rect = gameZone.getBoundingClientRect();
  const width = rect.width - 100;
  const height = rect.height - 100;

  function randomCoord(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  const gameZoneBtns = document.querySelectorAll('.game-zone button');
  gameZoneBtns.forEach((btn) => {
    const x = randomCoord(width);
    const y = randomCoord(height);

    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function createBtn() {
  const button = document.createElement('button');
  button.setAttribute('class', 'carrot-btn');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', 'carrot');
  button.innerHTML = '<img src="./assets/images/carrot.png" alt="당근" />';

  return button;
}

function gameOver() {
  result.classList.add('is-active');
  result.textContent = message.lose;
}

function win() {
  result.classList.add('is-active');
  result.textContent = message.win;
}

function timeover() {
  result.classList.add('is-active');
  result.textContent = message.timeover;
}

function reset() {
  time = init.time;
  count = init.count;

  timer.textContent = `00:${init.time}`;
  counter.textContent = init.count;
}

function changeControlBtn(event) {
  const newName = id === 'play' ? 'replay' : 'play';
  const ariaValue = newName === 'play' ? '시작' : '다시할래';

  event.target.setAttribute('data-id', `${newName}`);
  event.target.setAttribute('aria-label', `${ariaValue}`);
  event.target.innerHTML = `<i class="ic-${newName}" aria-hidden="true"></i>`;
}

window.addEventListener('load', () => {
  const carrotBtn = document.querySelectorAll('.carrot-btn');

  init.count = carrotBtn.length;
  reset();
});

header.addEventListener('click', (e) => {
  id = e.target.dataset.id;
  if (!id) return;

  if (id === 'replay') {
    clearInterval(countdown);

    gameZone.classList.remove('is-active');
    result.classList.remove('is-active');

    for (let i = 0; i < init.count - count; i++) {
      const bugBtn = document.querySelector('.bug-btn');
      const button = createBtn();
      gameZone.insertBefore(button, bugBtn);
    }

    reset();
  }

  if (id === 'play') {
    onClock();
    gameZone.classList.add('is-active');
  }

  changeControlBtn(e);
  setBtnLocation();
});

gameZone.addEventListener('click', (e) => {
  id = e.target.dataset.id;
  if (!id) return;

  if (id === 'bug') {
    clearInterval(countdown);
    gameOver();
  }

  if (id === 'carrot') {
    count -= 1;
    counter.textContent = count;
    gameZone.removeChild(e.target);

    const success = time > 0 && count === 0 ? true : false;

    if (success) {
      clearInterval(countdown);
      win();
    }
  }
});