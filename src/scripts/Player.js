import Gameboard from "./Gameboard";
import Ship from "./Ship";

export default class Player{
    constructor(type){
        this.type = type;
        this.gameboard = new Gameboard();
        this.attackRecord = new Set();
        this.lastHit = null;
        this.targetQueue = [];
    }

    humanAttack(opponentBoard,row,col){
        return opponentBoard.receiveAttack(row,col);
    }

   computerAttack(opponentBoard){
        let target;

        
        if(this.targetQueue.length > 0){
            target = this.targetQueue.shift();
        }else{
            do{
                const row = Math.floor(Math.random() * opponentBoard.size);
                const col = Math.floor(Math.random() * opponentBoard.size);

                target = {row,col};
            }while(this.attackRecord.has(`${target.row},${target.col}`))
        }

        this.attackRecord.add(`${target.row},${target.col}`);

        const result = opponentBoard.receiveAttack(target.row,target.col);

        if(result === 'hit'){

            const{row,col} = target;
            const size = opponentBoard.size;

            if(!this.lastHit){
                const candidates = [
                    { row: row - 1, col },     // up
                    { row: row + 1, col },     // down
                    { row, col: col - 1 },     // left
                    { row, col: col + 1 }      // right
                ];


                for(const c of candidates){
                    const key = `${c.row},${c.col}`;

                    if( c.row >= 0 &&
                        c.row < size &&
                        c.col >= 0 &&
                        c.col < size &&
                        !this.attackRecord.has(key)){
                            this.targetQueue.push(c);
                        }
                }
            }else{
                const dx = row - this.lastHit.row;
                const dy = col - this.lastHit.col;

                const next = { row: row + dx, col: col + dy };
                const reverse = { row: this.lastHit.row - dx, col: this.lastHit.col - dy };

                [next, reverse].forEach(c => {
                    const key = `${c.row},${c.col}`;
                    if (
                        c.row >= 0 && c.row < size &&
                        c.col >= 0 && c.col < size &&
                        !this.attackRecord.has(key)
                    ) {
                        this.targetQueue.push(c);
                    }
                });
            }

        
        }

        return result;
    }

    randomPlaceShips() {
        const shipsToPlace = [
            new Ship(5,'Carrier'), 
            new Ship(4,'Battleship'), 
            new Ship(3,'Cruiser'),
            new Ship(3,'Submarine'), 
            new Ship(2,'Destroyer')  
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
                   
                   
                }
            }
        });
    }
}

//module.exports = Player;