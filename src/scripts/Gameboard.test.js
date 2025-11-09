const Gameboard = require('./Gameboard');

describe('Gameboard class', () =>{
    test('create a board with size 10x10', () =>{
        const gameboard = new Gameboard();
        expect(gameboard.board.length).toBe(10);
        expect(gameboard.board[0].length).toBe(10);
    });

    test('all cells should initialize at 0', () =>{
        const gameboard = new Gameboard();
        for (let i = 0; i < gameboard.size; i++) {
            for (let j = 0; j < gameboard.size; j++) {
                expect(gameboard.board[i][j]).toBe(0);
            }
        }
    });
});