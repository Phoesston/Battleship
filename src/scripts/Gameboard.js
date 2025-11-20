import Ship from "./Ship";

export default class Gameboard{
    constructor(size = 10){
        this.size = size;
        this.board = this.createEmptyBoard();
        this.missedShots = [];
        this.ships = [];
        this.draggedShip = null;   
        this.orientation = 'horizontal'; 
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

    drawBoard(htmlContainer){
        htmlContainer.innerHTML = '';

        for(let row = 0; row<this.size; row++){
            for(let col = 0; col<this.size; col++){
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                //cellDiv.innerText = `r${row},c${col}`;

                const value = this.board[row][col];
                cellDiv.dataset.row = row;
                cellDiv.dataset.col = col;

                //displaye ships in the players board
                if(value instanceof Ship){
                    cellDiv.classList.add('Ship');
                }

                if (value === 'hit') cellDiv.classList.add('hit');
                if (value === 'miss') cellDiv.classList.add('miss');

                cellDiv.addEventListener('click', () =>{
                    const result = this.receiveAttack(row,col);

                    console.log(`Attack at ${row},${col}:`,result);

                    this.drawBoard(htmlContainer);
                });

                htmlContainer.appendChild(cellDiv);
            }
        }
    }

    enableShipDrag(shipElements, container) {
        shipElements.forEach(shipEl => {
            shipEl.addEventListener('dragstart', () => {
                this.draggedShip = new Ship(Number(shipEl.dataset.size));
            });

            shipEl.addEventListener('click', () => {
                this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
                shipEl.textContent = `${shipEl.dataset.name} (${this.orientation})`;
            });
        });

        const cells = container.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);

            cell.addEventListener('dragover', e => {
                e.preventDefault()
                if(!this.draggedShip) return;
                

                this.clearHighlights();
                this.highlight(row,col,this.draggedShip.size, this.orientation);

            });

            cell.addEventListener('dragleave', ()=>{
                this.clearHighlights();
            });

            cell.addEventListener('drop', () => {
                if (!this.draggedShip) return;
                try {
                    this.placeShip(this.draggedShip, row, col, this.orientation);
                    this.draggedShip = null;
                    this.drawBoard(container);
                } catch (err) {
                    alert(err.message);
                }
            });
        });
    }

    highlight(row,col,size,orientation){
        this.clearHighlights();

        for(let i = 0;i<size;i++){
            let r = row;
            let c = col;

            if(orientation === 'horizontal'){
                c+=i;
            }else{
                r += i
            }

            if(r>= this.size || c>= this.size) break;

            const cellDiv = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);

            if(cellDiv) cellDiv.classList.add('highlight');
        }
    }

    clearHighlights(){
        document.querySelectorAll('.cell.highlight').forEach(cell => {
            cell.classList.remove('highlight');
        });
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

//module.exports = Gameboard;