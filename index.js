import inquirer from 'inquirer';

import gameReducer, { move } from './game';
import { createStore } from 'redux';

// Create the store
const game = createStore(gameReducer);

const printBoard = () => {
  const { board } = game.getState();
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], '_'));
    }
    process.stdout.write('\n');
  }
};
let numTurns = 0;

const getInput = (player, numTurns) => async () => {
  numTurns += 1
  const { turn } = game.getState();
  if (turn !== player) return;
  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'coord',
      message: `${turn}'s move (row,col):`,
    },
  ]);
  const [row = 0, col = 0] = ans.coord.split(/[,\s+]/).map(x => +x);
  game.dispatch(move(turn, [row, col]));
  const winGame = winner(game.getState().board, numTurns);
  console.log('winGame', winGame)

};

const streak = (board, winningArrays) => {
  let winner = ''
  const reducer = (accumulator, currentVal) => {
    if (board[currentVal[0]] !== undefined) {
      accumulator += board[currentVal[0]][currentVal[1]];
      return accumulator
    } else {
      return accumulator;
    }
  };
  winningArrays.forEach(arr => {
    let result = arr.reduce(reducer, '');
    if (result === 'XXX') {
      console.log('X wins')
      winner = 'X'
    }
    else if (result === 'OOO') {
      console.log('O wins');
      winner = 'O'
    }
    else {
      winner = undefined;
    }
  });
  return winner
};

const winner = (board, numTurns) => {
  console.log('numTurns', numTurns)
  let boardJS = board.toJS();
  const winningPlayer = streak(boardJS, winningArrays);
  console.log('winningPlayer', winningPlayer)
  if (winningPlayer) {
    return winningPlayer
  }
  if (numTurns >= 10) {
    console.log('draw')
    return 'draw'
  }
};

const winningArrays = [
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[1, 0], [1, 1], [1, 2]],
  [[0, 1], [1, 1], [2, 1]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
  [[2, 2], [1, 1], [0, 0]],
];

//so, we need to check

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()))

game.subscribe(printBoard);
game.subscribe(getInput('X', numTurns));
game.subscribe(getInput('O', numTurns));

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: 'START' });
