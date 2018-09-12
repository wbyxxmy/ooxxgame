import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor() {
        super();
        this.state = {
            boardSize:15
        }
    }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(index, length) {
        let row = [];
        for(let i = 0; i < length; i++) {
            row.push(this.renderSquare(index + i));
        }
        return row;
    }

    render() {
        var board = [];
        for(let i = 0; i < this.state.boardSize; i++) {
            board.push(<div className="board-row">{this.renderRow(i*this.state.boardSize, this.state.boardSize)}</div>);
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(15*15).fill(null),
            }],
            lastLocation: [],
            xIsNext: true,
            stepNumber:0,
        }
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        console.log('this.state.stepNumber: ' + this.state.stepNumber);
        console.log('this.state.lastLocation: ' + this.state.lastLocation);

        const winner = calculateWinner(current.squares,this.state.lastLocation[this.state.stepNumber-1],this.state.xIsNext?'O':'X');

        const moves = history.map((step, move) => {
            const desc = move ? ('Move #' + move) : ('Game start');
            return (
                <li key={move}>
                    <button href="#" onClick={() => this.jumpTo(move)}>{desc}></button>
                </li>
            )
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const lastLocation = this.state.lastLocation;
        const squares = current.squares.slice();

        if(calculateWinner(squares, this.state.lastLocation[this.state.stepNumber - 1], this.state.xIsNext ? 'O' : 'X') || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history:history.concat([{
                squares: squares
            }]),
            lastLocation:lastLocation.concat([i]),
            xIsNext:!this.state.xIsNext,
            stepNumber: history.length,
        });
        console.log(i);
        console.log(this.state);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext:(step % 2)?false:true,
        });
    }
}

function calculateWinner(squares, step, player) {
    const move = [[[-1,0],[1,0]],[[0,-1],[0,1]],[[-1,-1],[1,1]],[[-1,1],[1,-1]]];

    for(let i = 0; i < move.length; i++) {
        let count = 1;
        let finish = false;

        for(let j = 0; j < 2; j++) {
            let x = step%15;
            let y = Math.floor(step/15);

            while (!finish) {
                x += move[i][j][0];
                y += move[i][j][1];

                console.log('i=' + i + ' x=' + x + ' y=' + y + ' x+15*y=' + (x + (15 * y)) + ' step=' + step);

                if (x < 0 || x >= 15 || y < 0 || y >= 15) {
                    console.log('out of board');
                    break;
                }
                console.log('squares[(x+ (y*15))]=' + squares[(x + (y * 15))] + ' player=' + player);
                if (squares[(x + (y * 15))] != player) {
                    console.log('line finished');
                    break;
                }
                count++;
                console.log('count: ' + count);
                if (count >= 5) {
                    finish = true;
                }
            }
            if (finish) {
                return player;
            }
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
