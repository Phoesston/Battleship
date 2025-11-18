export default class Ship{
    constructor(size){
        this.size=size;
        this.hitCounter = 0;
        this.sunk = false;

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