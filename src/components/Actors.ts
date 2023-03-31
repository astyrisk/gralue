import State from "./State";

//DONE left-bug rechecked
/* consts */
const MONSTERSPEED = 4;
const wobbleSpeed = 8, wobbleDist = 0.07;
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;


/* PLAYER, LAVA, COIN, MONSTER */

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



class Player {
    pos: Vector;
    speed: Vector;
    size: Vector;

    constructor(pos: Vector, speed: Vector) {
        this.pos = pos
        this.speed = speed;
    }
    get type() {
        return "player";
    }
    static create(pos: Vector) {
        return new Player(pos.plus(new Vector(0, -0.5)), new Vector(0, 0));
    }
    update(time: number, state: State, keys: any) {
        let xSpeed = 0;

        if (keys.ArrowLeft) 
            xSpeed -= playerXSpeed;
        if (keys.ArrowRight) 
            xSpeed += playerXSpeed;

        let pos = this.pos;
        let movedX = pos.plus(new Vector(xSpeed * time, 0));

        if (!state.level.touches(movedX, this.size, "wall")) { 
            pos = movedX;
        }

        let ySpeed = this.speed.y + (time * gravity);
        let movedY = pos.plus(new Vector(0, (ySpeed * time)));

        if (!state.level.touches(movedY, this.size, "wall")) 
            pos = movedY; 
        else if (keys.ArrowUp && ySpeed > 0)  
            ySpeed -= jumpSpeed; 
        else  
            ySpeed = 0; 

        return new Player(pos, new Vector(xSpeed, ySpeed));
    }
}

class Lava {
    pos: Vector;
    speed: Vector;
    reset: any;
    size: Vector;

    constructor(pos: Vector, speed: Vector, reset: any) {
        this.pos = pos
        this.speed = speed
        if (reset != null) this.reset = reset
    }

    get type() {
        return "lava";
    }

    static create(pos: Vector, ch: string) {
        switch (ch) {
            case "=":
                return new Lava(pos, new Vector(2, 0), null);
            case "|":
                return new Lava(pos, new Vector(0, 2), null);
            case "v":
                return new Lava(pos, new Vector(0, 3), pos);
        }
    }
    collide(state: State) {
        return new State(state.level, state.actors, "lost");
    }
    update(time: number, state: State) {
        let newPos = this.pos.plus(this.speed.times(time));
        if (!state.level.touches(newPos, this.size, "wall")) 
            return new Lava(newPos, this.speed, this.reset);
        else if (this.reset) 
            return new Lava(this.reset, this.speed, this.reset);
        else 
            return new Lava(this.pos, this.speed.times(-1), null);
    }
}

class Coin {
    pos: Vector;
    basePos: Vector;
    size: Vector;
    wobble: number;
    constructor(pos: Vector, basePos: Vector, wobble: number) {
        this.pos = pos
        this.basePos = basePos
        this.wobble = wobble
    }
    get type() {
        return "coin"; 
    }

    static create(pos) { 
        let basePos = pos.plus(new Vector(0.2, 0.1));
        return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
    }
    collide(state: State) {
        let filtered = state.actors.filter(a => a != this);
        let status = state.status;
        if (!filtered.some(a => a.type =="coin")) 
            status = "won";
        return new State(state.level, filtered, status);
    }
    update(time: number) {
        let wobble = this.wobble + time * wobbleSpeed;
        let wobblePos = Math.sin(wobble) * wobbleDist;

        return new Coin(this.basePos.plus(new Vector(0, wobblePos)), this.basePos, wobble);
    }
}

class Monster { 
    pos: Vector;
    size: Vector
    constructor(pos: Vector) {
        this.pos = pos;
    }

    static create(pos: Vector) {
        return new Monster(pos.plus(new Vector(0, -1)));
    }

    update(time: number, state: State) {
        let player = state.player;
        let speed = (player.pos.x < this.pos.x ? -1 : 1) * time * MONSTERSPEED;
        let newPos = new Vector(this.pos.x + speed, this.pos.y);

        if (state.level.touches(newPos, this.size, "wall"))  {
            return this;
        } else  {
            return new Monster(newPos);
        }
    }

    collide(state: State) {
        let player = state.player;

        if ((player.pos.y + player.size.y) < (this.pos.y + 0.5)) { 
            let filtered = state.actors.filter(a => a != this);
            return new State(state.level, filtered, state.status);
        } else {
            return new State(state.level, state.actors, "lost");
        }
    }
}

Player.prototype.size = new Vector(0.8, 1.5);
Lava.prototype.size = new Vector(1, 1);
Coin.prototype.size = new Vector(0.6, 0.6);
Monster.prototype.size = new Vector(1.2, 2);


export {Player, Lava, Coin, Monster};
