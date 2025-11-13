const Gameboard = require('./Gameboard');

class Player{
    constructor(type){
        this.type = type;
        this.gameboard = new Gameboard();
        this.attackRecord = new Set();
    }

    humanAttack(opponentBoard,row,col){
        return opponentBoard.receiveAttack(row,col);
    }

   computerAttack(opponentBoard){
        let row, col, result;

        do {
            row = Math.floor(Math.random() * opponentBoard.size);
            col = Math.floor(Math.random() * opponentBoard.size);

            if(opponentBoard.board[row][col] === 'hit'){
                const direction = Math.random() < 0.5 ? 'row' : 'col';

                if(direction === 'row' && row + 1 < opponentBoard.size && !this.attackRecord.has(`${row+1},${col}`)){
                    row += 1;
                } else if(direction === 'col' && col + 1 < opponentBoard.size && !this.attackRecord.has(`${row},${col+1}`)){
                    col +=1;
                } else if(direction === 'row' && col + 1 < opponentBoard.size && !this.attackRecord.has(`${row},${col+1}`)){
                    col +=1;
                } else if(direction === 'col' && row + 1 < opponentBoard.size && !this.attackRecord.has(`${row+1},${col}`)){
                    row +=1;
                }
                // if all adjacent options are already attacked, do nothing; loop picks a random cell next
            }

        } while (this.attackRecord.has(`${row},${col}`));

        const key = `${row},${col}`;
        this.attackRecord.add(key);

        result = opponentBoard.receiveAttack(row,col);

        return result;
}
}

module.exports = Player;