'use strict';

import PopUp from './_popup.js';
import { GameBuilder, Reason } from './_game.js';
import * as sound from './_sound.js';

const gameFinishBanner = new PopUp();

const game = new GameBuilder()
  .setCarrotCount(3)
  .setBugCount(150)
  .setGameDuration(5)
  .build();

game.setGameStopListener((reason) => {
  let message;

  switch (reason) {
    case Reason.win:
      sound.playWin();
      message =
        '<i aria-hidden="true">🥕🥕🥕</i> YEAH! YOU WIN! <i aria-hidden="true">💪😎🔥</i>';
      break;

    case Reason.lose:
      message =
        '<i aria-hidden="true">🐛🐛🐛</i> YOU LOSE <i aria-hidden="true">🥲 💦</i>';
      break;

    case Reason.timeover:
      sound.playBug();
      message = '<i aria-hidden="true">⏰</i> Time Over';
      break;

    case Reason.replay:
      sound.playAlert();
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
