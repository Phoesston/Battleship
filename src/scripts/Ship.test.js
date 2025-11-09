const Ship = require('./Ship');

describe('Ship class', () => {
    test('Ship should start unsunk', () => {
        const ship = new Ship(3);

        expect(ship.isSunk()).toBe(false);
    });

    test('Hitting should increase the counter', () =>{
        const ship = new Ship(4);

        ship.hit();
        expect(ship.hitCounter).toBe(1);

        ship.hit();
        expect(ship.hitCounter).toBe(2);
    });

    test ('Ship sinks when hits equal the size', () => {
        const ship = new Ship(2);

        ship.hit();
        expect(ship.isSunk()).toBe(false);

        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });

    test('Ship does not sink before enough hits', () => {
        const ship = new Ship(3);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(false);  
    });
});

