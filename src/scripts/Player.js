import Gameboard from "./Gameboard";

export default class Player{
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

    randomPlaceShips() {
        const shipsToPlace = [
            new Ship(5), // Carrier
            new Ship(4), // Battleship
            new Ship(3), // Cruiser
            new Ship(3), // Submarine
            new Ship(2)  // Destroyer
        ];

        shipsToPlace.forEach(ship => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * this.gameboard.size);
                const col = Math.floor(Math.random() * this.gameboard.size);
                const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                
                try {
                    this.gameboard.placeShip(ship, row, col, direction);
                    placed = true;
                } catch (err) {
                    // Failed placement (collision or out of bounds), try again
                }
            }
        });
    }
}

//module.exports = Player;