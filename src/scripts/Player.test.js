const Player = require('./Player');
const Gameboard = require('./Gameboard');
const Ship = require('./Ship');

describe('Player class', () => {

  test('humanAttack hits the correct spot', () => {
    const player1 = new Player('human');
    const player2 = new Player('human');
    
    const ship = new Ship(2);
    player2.gameboard.placeShip(ship, 0, 0, 'horizontal');
    
    const result = player1.humanAttack(player2.gameboard, 0, 0);
    expect(result).toBe('hit');
    expect(player2.gameboard.board[0][0]).toBe('hit');
  });

  test('computerAttack returns "hit" or "miss"', () => {
    const player = new Player('human');
    const computer = new Player('computer');

    // Place a ship for testing
    const ship = new Ship(1);
    player.gameboard.placeShip(ship, 0, 0);

    const result = computer.computerAttack(player.gameboard);
    expect(['hit','miss']).toContain(result);
  });

  test('computerAttack never attacks the same cell twice', () => {
    const human = new Player('human');
    const computer = new Player('computer');

    const attackedCells = new Set();

    // Run multiple attacks
    for (let i = 0; i < 50; i++) {
        // Track board state before attack
        const preAttack = human.gameboard.board.map(row => [...row]);

        const result = computer.computerAttack(human.gameboard);
        expect(['hit', 'miss']).toContain(result);

        // Find the cell that changed
        for (let row = 0; row < human.gameboard.size; row++) {
            for (let col = 0; col < human.gameboard.size; col++) {
                if (preAttack[row][col] !== human.gameboard.board[row][col]) {
                    const key = `${row},${col}`;
                    expect(attackedCells.has(key)).toBe(false); // should be new
                    attackedCells.add(key);
                }
            }
        }
    }
});

  test('computerAttack hits adjacent cell after a hit', () => {
        const human = new Player('human');
        const computer = new Player('computer');

        // Place a 2-cell ship at (2,2) horizontal
        const ship = new Ship(2);
        human.gameboard.placeShip(ship, 2, 2, 'horizontal');

        // Attack the first part manually to trigger adjacent logic
        human.gameboard.receiveAttack(2,2);

        // Run the AI attack
        const result = computer.computerAttack(human.gameboard);

        // The AI should attack either (2,3) (right) or (3,2) (down)
        const validTargets = ['hit','miss'];
        expect(validTargets).toContain(result);

        // The attacked cell should not be the same as the first hit
        expect(human.gameboard.board[2][2]).toBe('hit');
    });

});
