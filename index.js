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

const getInput = player => async () => {
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
  winner(game.getState().board);
};

const streak = (board, winningArrays) => {
  const reducer = (accumulator, currentVal) => {
    // console.log('currentVal[0]', currentVal[0])
    // console.log('currentVal[1]', currentVal[1])
    // console.log('board[currentVal[0]]', board[currentVal[0]])
    // console.log('board', board);
    // console.log('board[currentVal[0][currentVal[1]]]', board[currentVal[0][currentVal[1]]])
    if (board[currentVal[0]] !== undefined) {
      accumulator += board[currentVal[0]][currentVal[1]];
      // console.log('accumulator', accumulator)
      return accumulator
    } else {
      return accumulator;
    }
  };

  winningArrays.forEach(arr => {
    // console.log('arr', arr)
    let result = arr.reduce(reducer, '');
    // console.log('result', result);
    if (result === 'XXX') console.log('X wins');
    else if (result === 'OOO') console.log('O wins');
    else {
      return undefined;
    }
  });
};

const winner = board => {
  let boardJS = board.toJS();
  streak(boardJS, winningArrays);
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
game.subscribe(getInput('X'));
game.subscribe(getInput('O'));

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: 'START' });
