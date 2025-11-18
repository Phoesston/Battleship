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

            // Draw board
            this.player1.gameboard.drawBoard(boardContainer);

            // Enable drag & drop
            const shipContainer = document.getElementById('ship-container');
            const ships = Array.from(shipContainer.querySelectorAll('.ship'));
            this.player1.gameboard.enableShipDrag(ships, boardContainer);

        } else if (screen === 'game') {
            document.getElementById('game-screen').classList.remove('hidden');
            this.player1.gameboard.drawBoard(document.getElementById('player-board'));
            this.player2.gameboard.drawBoard(document.getElementById('opponent-board'));
        }
    }

    startGame(){
        this.state.phase = 'playing';
        this.switchScreen('game');

        if (this.state.mode === 'pvc' && this.state.turn === 'computer') {
            this.computerTurn();
        }
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
            const result = this.player2.computerAttack(this.player1.gameboard);
            console.log('Computer attacked:', result);

            // redraw board
            this.player1.gameboard.drawBoard(document.getElementById('player-board'));

            this.checkGameOver();
            if (this.state.phase !== 'gameover') {
                this.nextTurn();
            }
        }, 500);
    }

    checkGameOver() {
        if (this.player1.gameboard.allShipsSunk()) {
            alert("Player 2 wins!");
            this.state.phase = "gameover";
        } else if (this.player2.gameboard.allShipsSunk()) {
            alert(this.state.mode === "pvc" ? "Computer wins!" : "Player 1 wins!");
            this.state.phase = "gameover";
        }
    }
}


//module.exports = Game;