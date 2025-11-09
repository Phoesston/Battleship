class Gameboard{
    constructor(size = 10){
        this.size = size;
        this.board = this.createEmptyBoard();
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
}

module.exports = Gameboard;