const Ship =  require('./Ship');

class Gameboard{
    constructor(size = 10){
        this.size = size;
        this.board = this.createEmptyBoard();
        this.missedShots = [];
        this.ships = [];
    }

    createEmptyBoard(){

        const board = [];

        for(let i = 0 ; i<this.size ; i++){
            const row = [];

            for(let j = 0; j<this.size ; j++){
                row.push(0);
            }

            board.push(row);
        }

        return board;
    }

    placeShip(ship, row, col, direction = "horizontal") {
        const size = ship.size;

        // Boundary checking
        if (direction === "horizontal") {
            if (col + size > this.size) {
                throw new Error("Ship placement out of bounds (horizontal)");
            }
        } else {
            if (row + size > this.size) {
                throw new Error("Ship placement out of bounds (vertical)");
            }
        }

        // Collision checking
        if (direction === "horizontal") {
            for (let i = 0; i < size; i++) {
                if (this.board[row][col + i] !== 0) {
                    throw new Error("Ship collides with another ship");
                }
            }
        } else {
            for (let i = 0; i < size; i++) {
                if (this.board[row + i][col] !== 0) {
                    throw new Error("Ship collides with another ship");
                }
            }
        }

        // Placement
        if (direction === "horizontal") {
            for (let i = 0; i < size; i++) {
                this.board[row][col + i] = ship;
            }
        } else {
            for (let i = 0; i < size; i++) {
                this.board[row + i][col] = ship;
            }
        }

        this.ships.push(ship);
    }   

    receiveAttack(row, col){
        const target = this.board[row][col];

        if(target === 'hit' || target === 'miss'){
            return;
        }

        if(target instanceof Ship){
            target.hit();
            this.board[row][col] = 'hit';
            return 'hit';
        }

        this.board[row][col] = 'miss';
        this.missedShots.push([row,col]);

        return 'miss';
    }

    isShipSunk(ship) {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === ship) return false;
            }
        }
        return true;
    }

    allShipsSunk() {
        for (const ship of this.ships) {
            if (!this.isShipSunk(ship)) {
                return false;
            }
        }
        return true;
    }

}

module.exports = Gameboard;