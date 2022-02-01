'use strict';

import PopUp from './_popup.js';
import Game from './_game.js';

const gameFinishBanner = new PopUp();
const game = new Game(1, 100, 3);
game.setGameStopListener((reason) => {
  let message;

  switch (reason) {
    case 'win':
      message =
        '<i aria-hidden="true">🥕🥕🥕</i> YEAH! YOU WIN! <i aria-hidden="true">💪😎🔥</i>';
      break;

    case 'lose':
      message =
        '<i aria-hidden="true">🐛🐛🐛</i> YOU LOSE <i aria-hidden="true">🥲 💦</i>';
      break;

    case 'timeover':
      message = '<i aria-hidden="true">⏰</i> Time Over';
      break;

    case 'replay':
      message = '<i aria-hidden="true">♻️</i> Replay?';
      break;

    default:
      throw new Error('not valid reason ');
  }

  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.refresh();
  game.start();
});
