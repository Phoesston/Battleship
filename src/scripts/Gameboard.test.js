const Gameboard = require('./Gameboard');
const Ship = require('./Ship');

describe('Gameboard class', () =>{
    test('create a board with size 10x10 and draws it', () =>{
        const gameboard = new Gameboard();

        console.log(gameboard);

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

    test('places a horizontal ship correctly', () => {
        const gameboard = new Gameboard();
        const ship = new Ship(3);

        gameboard.placeShip(ship, 0, 0, 'horizontal');

        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[0][1]).toBe(ship);
        expect(gameboard.board[0][2]).toBe(ship);
    });

    test('places a vertical ship correctly', () => {
        const gameboard = new Gameboard();
        const ship = new Ship(2);

        gameboard.placeShip(ship, 1, 1, 'vertical');

        expect(gameboard.board[1][1]).toBe(ship);
        expect(gameboard.board[2][1]).toBe(ship);
    });

    test('throws error if horizontal ship is out of bounds', () =>{
        const gameboard = new Gameboard();
        const ship = new Ship(4);

        expect(() => gameboard.placeShip(ship, 0, 8, 'horizontal')).toThrow("Ship placement out of bounds (horizontal)");
    });

    test('throws error if vertical ship is out of bounds', () =>{
        const gameboard = new Gameboard();
        const ship = new Ship(4);

        expect(() => gameboard.placeShip(ship, 8, 1, 'vertical')).toThrow("Ship placement out of bounds (vertical)");
    });

    test('throws error if it collides with another ship', () =>{
        const gameboard = new Gameboard();
        const ship1 = new Ship(3);
        const ship2 = new Ship(4);

        gameboard.placeShip(ship1,0,0,'horizontal');

        expect(() => gameboard.placeShip(ship2,0,1,'horizontal')).toThrow('Ship collides with another ship');
    });

    test("receiveAttack returns 'hit' and marks the board", () => {
        const board = new Gameboard();
        const destroyer = new Ship(2)
        board.placeShip(destroyer,0,0,'horizontal');

        expect(board.receiveAttack(0, 0)).toBe("hit");
        expect(board.board[0][0]).toBe("hit");
    });

    test("receiveAttack returns 'miss' and records missed shot", () => {
        const board = new Gameboard();

        expect(board.receiveAttack(1, 1)).toBe("miss");
        expect(board.board[1][1]).toBe("miss");
        expect(board.missedShots).toContainEqual([1, 1]);
    });

    test("receiveAttack does nothing if already hit or missed", () => {
        const board = new Gameboard();

        board.board[2][2] = "hit";
        expect(board.receiveAttack(2, 2)).toBeUndefined();

        board.board[3][3] = "miss";
        expect(board.receiveAttack(3, 3)).toBeUndefined();
    });

    test("isShipSunk returns false if any part of the ship remains", () => {
        const board = new Gameboard();
        const destroyer = new Ship(2)
        board.placeShip(destroyer,0,0,'horizontal');

        expect(board.isShipSunk(destroyer)).toBe(false);
    });

    test("isShipSunk returns true when the ship no longer appears", () => {
        const board = new Gameboard();
        const destroyer = new Ship(2)
        board.placeShip(destroyer,0,0,'horizontal');

        board.board[0][0] = "hit";
        board.board[0][1] = "hit";

        expect(board.isShipSunk("destroyer")).toBe(true);
    });

    test("allShipsSunk returns false if at least one ship is still alive", () => {
        const board = new Gameboard();

        const destroyer = new Ship(2)
        const submarine = new Ship(3)
        board.placeShip(destroyer,0,0,'horizontal');
        board.placeShip(submarine,1,0,'horizontal');

        board.receiveAttack(1,0);
        board.receiveAttack(1,1);
        board.receiveAttack(1,2); //submarine should be sunk but destroyer is alive


        expect(board.allShipsSunk()).toBe(false);
    });

    test("allShipsSunk returns true when every ship is sunk", () => {
        const board = new Gameboard();
        board.shipNames = ["destroyer", "submarine"];

        board.board = board.board.map(row =>
            row.map(() => "hit")
        ); // simulate everything hit

        expect(board.allShipsSunk()).toBe(true);
    });



   
});