import Player from "./Player";

export default class Game{
    constructor(){
        this.state = {
            mode:null,
            phase: "menu",
            turn: "player1"
        }

        this.player1 = new Player('human');
        this.player2 = null;

        this.modeUI();
    }

    setupBoardListeners(){
        const player2Board = document.getElementById('player2-board');

        player2Board.addEventListener('click', (e) => {
            // Only proceed if we clicked on a cell
            if (e.target.classList.contains('cell')) {
                const row = Number(e.target.dataset.row);
                const col = Number(e.target.dataset.col);
                this.handleAttack(row, col);
            }
        });
    }

    handleAttack(row, col) {
        
        if (this.state.phase !== 'playing') return;
        if (this.state.turn !== 'player1') return;

        const result = this.player2.gameboard.receiveAttack(row, col);

        
        if (result === 'hit' || result === 'miss') {
            this.updateBoards(); // Redraw
            this.checkGameOver();
            
            if (this.state.phase !== 'gameover') {
                this.nextTurn();
                if (this.state.mode === 'pvc') {
                    this.computerTurn();
                }
            }
        }
    }

    updateBoards() {
        const p1Board = document.getElementById('player1-board');
        const p2Board = document.getElementById('player2-board');

        this.player1.gameboard.drawBoard(p1Board, true);
        this.player2.gameboard.drawBoard(p2Board, false);

        this.updateSunkList();
        this.setupBoardListeners();
    }

    modeUI() {
        document.getElementById('pvpBtn').addEventListener('click', () => {
            this.state.mode = "pvp";
            this.player2 = new Player('human');
            this.switchScreen('placement');
        });

        document.getElementById('pvcBtn').addEventListener('click', () => {
            this.state.mode = "pvc";
            this.player2 = new Player('computer');
            this.switchScreen('placement');
        });

        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });
    }

    switchScreen(screen) {
        ['menu-screen', 'placement-screen', 'game-screen'].forEach(s => 
            document.getElementById(s).classList.add('hidden')
        );

        if (screen === 'placement') {
            const boardContainer = document.getElementById('player-board-container');
            document.getElementById('placement-screen').classList.remove('hidden');

            if(this.state.mode === 'pvc'){
                this.player1.gameboard.enableShipDrag(boardContainer);
                this.player2.randomPlaceShips();
            }else{
                this.player1.gameboard.enableShipDrag(boardContainer);
                this.player2.gameboard.enableShipDrag(boardContainer);
            }
            
                   

        } else if (screen === 'game') {
            document.getElementById('game-screen').classList.remove('hidden');

            if(this.state.mode ==='pvc'){
                this.player1.gameboard.drawBoard(document.getElementById('player1-board'),true);
                this.player2.gameboard.drawBoard(document.getElementById('player2-board'),false);
            }else{
                
            }
        }
    }

    pvpMode(){
        const placementScreen = document.getElementById('placement-screen');

        placementScreen.innerHTML = `

        <h2>Player 1</h2>
        <h2>Place Your Ships</h2>

        <div id="ship-container">
            <div class="ship" draggable="true" data-size="5" data-name = "Submarine">Carrier</div>
            <div class="ship" draggable="true" data-size="4" data-name = "Battleship">Battleship</div>
            <div class="ship" draggable="true" data-size="3" data-name = "Cruiser">Cruiser</div>
            <div class="ship" draggable="true" data-size="3" data-name = "Submarine">Submarine</div>
            <div class="ship" draggable="true" data-size="2" data-name = "Destroyer">Destroyer</div>
        </div>

        <div id="player-board-container" class="board"></div>

        <div class="bottom-buttons">
          <button id="start-game-btn">Start Game</button>
          <button id="direction-btn">Horizontal</button>
        </div>
        `;


    }


    startGame(){
        this.state.phase = 'playing';
        this.switchScreen('game');
        this.updateTurnInfo();

        this.setupBoardListeners();

        if (this.state.mode === 'pvc' && this.state.turn !== 'player1') {
            this.computerTurn();
        }


    }

    updateSunkList(){
        const player1SunkContainer = document.getElementById('player1-sunked');
        const player2SunkContainer = document.getElementById('player2-sunked');

        player1SunkContainer.innerHTML = '';
        player2SunkContainer.innerHTML = '';

        this.player1.gameboard.ships.forEach(ship => {
            if(this.player1.gameboard.isShipSunk(ship)){
                const entry = document.createElement('div');
                entry.classList.add('sunk-entry');
                entry.textContent = ship.name;
                player1SunkContainer.appendChild(entry);

                entry.classList.add("new");
                setTimeout(() => entry.classList.remove("new"), 600);
            }
        });

        this.player2.gameboard.ships.forEach(ship =>{
            if(this.player2.gameboard.isShipSunk(ship)){
                const entry = document.createElement('div');
                entry.classList.add('sunk-entry');
                entry.textContent = ship.name;
                player2SunkContainer.appendChild(entry);

                entry.classList.add("new");
                setTimeout(() => entry.classList.remove("new"), 600);
            }
            
        });
    }


    updateTurnInfo() {
        const turnText = this.state.turn === 'player1' ? "Player 1's Turn" :
                         this.state.turn === 'player2' ? "Player 2's Turn" :
                         "Computer's Turn";
        document.getElementById('turn-info').textContent = turnText;
    }

    nextTurn() {
        if (this.state.mode === "pvp") {
            this.state.turn = this.state.turn === 'player1' ? 'player2' : 'player1';
        } else {
            this.state.turn = this.state.turn === 'player1' ? 'computer' : 'player1';
        }
        this.updateTurnInfo();
    }

    computerTurn() {
        setTimeout(() => {
            if (this.state.phase === 'gameover') return;

            this.player2.computerAttack(this.player1.gameboard);
            
            this.updateBoards(); 
            this.updateSunkList();

            this.checkGameOver();
            
            if (this.state.phase !== 'gameover') {
                this.nextTurn();
            }
        }, 1000);
    }

    checkGameOver() {
        
        if (this.player1.gameboard.allShipsSunk()) {
            if (this.state.mode === 'pvc') {
                alert("Computer wins!");
            } else {
                alert("Player 2 wins!");
            }
            this.state.phase = "gameover";
            return;
        }

        
        if (this.player2.gameboard.allShipsSunk()) {
            if (this.state.mode === 'pvc') {
                alert("You win!");
            } else {
                alert("Player 1 wins!");
            }
            this.state.phase = "gameover";
        }
    }
}


//module.exports = Game;