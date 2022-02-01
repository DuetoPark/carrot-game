'use strict';

import * as sound from './_sound.js';

const CARROT_SIZE = 100;

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.field = document.querySelector('.game-field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', this.onClick);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('carrot', this.carrotCount, 'carrot.png');
    this._addItem('bug', this.bugCount, 'bug.png');
  }

  _addItem(className, count, imgName) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;

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
      this.field.appendChild(btn);
    }
  }

  onClick = (event) => {
    const target = event.target;
    const carrot = target.matches('.carrot-btn');
    const bug = target.matches('.bug-btn');

    if (carrot) {
      sound.playCarrot();
      target.remove();
      this.onItemClick && this.onItemClick('carrot');
    }

    if (bug) {
      sound.playBug();
      this.onItemClick && this.onItemClick('bug');
    }
  };
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
