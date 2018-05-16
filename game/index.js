import { Map } from 'immutable';

let board = Map();

const initialState = {
  board: board,
  turn: 'X',
};

export default function reducer(state = initialState, action) {
  if (action.type === 'MOVE') {
    return {
      board: state.board.setIn(action.position, action.turn),
      turn: state.turn === 'X' ? 'O' : 'X',
    };
  }
  return state;
}

//action creator
export const move = (turn, position) => {
  return {
    type: 'MOVE',
    turn,
    position,
  };
};
