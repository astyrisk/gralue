import { Player, Lava, Coin, Monster } from "./components/Actors";

class Vector { 
    x: number;
    y: number; 

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(other: Vector) {
        return new Vector(this.x + other.x, this.y  +other.y);
    }

    times(factor: number) {
        return new Vector(this.x * factor, this.y * factor);
    }
}

var levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava, "M": Monster
};

type Actor = Player | Lava | Coin | Monster;

export  { Vector, levelChars, Actor };