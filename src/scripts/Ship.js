export default class Ship{
    constructor(size,name){
        this.size=size;
        this.name = name;
        this.hitCounter = 0;
        this.sunk = false;
        this.orientation = 'horizontal';

    }

    hit(){
        this.hitCounter +=1;
        this.isSunk();
    }

    isSunk(){
        if (this.hitCounter >= this.size){
            this.sunk = true;
        }

        return this.sunk;
    }
}

//module.exports = Ship;