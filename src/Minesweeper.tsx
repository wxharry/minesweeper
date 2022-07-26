import React, {useEffect, useState} from 'react';
import useLongPress from './util/useLongPress';
import Timer from './timer';
import './Minesweeper.css';

const Square = ({value, onClick, onLongPress}:any) => {
  const longPressEvent = useLongPress({onLongPress, onClick});
  const showValue = (value:any) => {
    switch (value) {
      case null:
      case 0:
        return "";
      case -1:
        return "☠️";
      case -2:
        return "🚩"
      default:
        return value;
    }
  }
  return (
    <button className={value === null ? "square": "square-grey"}
            {...longPressEvent}
            >
      {showValue(value)}
    </button>
  );
}

const renderRow = ({cover, row, rowIdx, handleClick, onLongPress}:any) => {
  return (
    <div>
      { row.map((ele: any, colIdx:any) => {
        return <Square value={cover[rowIdx][colIdx]}
                onClick={()=>{return handleClick({row:rowIdx, col:colIdx})}}
                onLongPress={()=>{return onLongPress({row:rowIdx, col:colIdx})}}
                />
                })}
    </div>
  )
}

const calcNumber = ({board, x, y}:any) => {
  const row = board.length;
  const col = board[0].length;
  const directions = [[-1, -1], [1, 1], [-1,  1], [1, -1],
                      [ 0,  1], [1, 0], [-1,  0], [0, -1]];
  let sum = 0;
  for (let i=0; i < 8; i+=1) {
    let _x = x + directions[i][0], _y = y + directions[i][1];
    if ( _x >= 0 && _x < row && _y >= 0 && _y < col && board[_x][_y] === -1 ) {
      sum += 1;
    }
  }
  return sum;
}

const valid2place = ({board, x, y}:any) => {
  const row = board.length;
  const col = board[0].length;
  const directions = [[-1, -1], [1, 1], [-1,  1], [1, -1],
                      [ 0,  1], [1, 0], [-1,  0], [0, -1]];
  let sum = 0;
  for (let i=0; i < 8; i+=1) {
    let _x = x + directions[i][0], _y = y + directions[i][1];
    if ( _x < 0 || _x >= row || _y < 0 || _y >= col) {
      sum += 1;
    } else if (board[_x][_y] === -1) {
      sum += 1;
    }
  }
  return sum !== 8;
}

const initBoard = ({row, col, mineNumber}: any) => {
  const board = Array(row).fill(null).map(() => Array(col).fill(0));
  // place mines
  for (let i = 0; i < mineNumber; ) {
    let x = Math.floor(Math.random() * row);
    let y = Math.floor(Math.random() * col);
    if (board[x][y] === 0 && valid2place({board, x, y})) {
      board[x][y] = -1;
      i += 1;
    }
  }
  
  // calculate numbers
  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      if (board[i][j] !== -1) {
        board[i][j] = calcNumber({board, x: i, y: j});
      }
    }
  }
  return board;
}

const isFinished = ({board, cover}: any) => {
  const row = board.length;
  const col = board[0].length;
  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      if (cover[i][j] === null || board[i][j] < 0 && cover[i][j] !== -2) {
        return false;
      }
    }
  }
  return true;
}

const Board = () => {
  const height=5, width=5;
  const initMineNumber = 5
  const [mineNumber, setMineNumber] = useState(initMineNumber);
  const [state, setState] = useState(0);
  const [cover, setCover] = useState(Array(height).fill(null).map(() => Array(width).fill(null)))
  const [board, setBoard] = useState(initBoard({row: height, col: width, mineNumber}));
  const [timerState, setTimerState] = useState(false);
  const [resetState, setReset] = useState(true);

  const handleClick = ({row, col}:any) => {
    if (state !== 0) {
      handleReset();
      return;
    }
    setTimerState(true);
    const _board = board.slice();
    const _cover = cover.slice();
    _cover[row][col] = _board[row][col];
    setCover(_cover);
    if (board[row][col] < 0) {
      console.log("Boom! Game Over!");
      setState(-1);
      setTimerState(false);
    }
  }

  const onLongPress = ({row, col}:any) => {
    if (state !== 0) {
      handleReset();
      return;
    }
    const _cover = cover.slice();
    if (_cover[row][col] === null) {
      _cover[row][col] = -2;
      setMineNumber(mineNumber => mineNumber - 1);
    } else { // if flag out a mine
      _cover[row][col] = null;
      setMineNumber(mineNumber => mineNumber + 1);
    }
    setCover(_cover);
  };

  useEffect(()=>{
    // console.log("change on cover");
    if (isFinished({board, cover})) {
      setState(1);
      setTimerState(false);
      console.log("You win! Well Done.");
    }
  }, [cover])

  const handleReset = () => {
    // console.log("handle reset");
    setMineNumber(initMineNumber);
    // console.log("mineNumber", mineNumber); //why is mineNumber 0?
    setBoard(initBoard({row: height, col: width, mineNumber:initMineNumber}))
    setCover(Array(height).fill(null).map(() => Array(width).fill(null)));
    setState(0);
    setReset(!resetState);
  }

  return (
    <div>
      <div className='board-top'>
        <div> {mineNumber} </div>
        <div> {state === 0 ? '🤨':( state > 0 ? '😎' : '😵‍💫')} </div>
        <Timer active={timerState} resetTimer={resetState}/>
      </div>
      <div className='board-row'>
        { board.map((row, rowIdx) => { return renderRow({cover, row, rowIdx, handleClick, onLongPress})}) }
      </div>
    </div>
  )
}

const Minesweeper = () => {
  return (
    <div className="App">
      <Board></Board>
    </div>
  );
}

export default Minesweeper;
