import { Map } from 'immutable';

let board = Map();

const initialState = {
  board: board,
  turn: 'X',
};

export default function reducer(state = initialState, action) {
  //if action.type === 'WIN...then put that onto state and do something
  return {
    board: boardReducer(state.board, action),
    turn: turnReducer(state.turn, action)
  }
}

const turnReducer = (turn='X', action) => {
  if (action.type === 'MOVE') {
    return turn === 'X' ? 'O' : 'X'
  }
  return turn
}

const boardReducer = (board = Map(), action) => {
  if (action.type === 'MOVE') return board.setIn(action.position, action.turn)
  return board
}

//action creator
export const move = (turn, position) => {
  return {
    type: 'MOVE',
    turn,
    position,
  };
};
