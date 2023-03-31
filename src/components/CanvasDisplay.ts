import { Player, Coin, Lava, Monster } from "./Actors";
import { Actor } from "../types";
import Level from "../Level";
import State from "./State";
import {flipHorizontally} from "../helpers";

const SCALE: number = 20;
const PLAYERXOVERLAP = 4;
const playerXOverlap = 4;
let otherSprites: HTMLImageElement = document.createElement("img"); 
let playerSprite: HTMLImageElement = document.createElement("img");
playerSprite.src ="./player.png"
otherSprites.src = "./sprites.png";

class CanvasDisplay  {
    canvas: HTMLCanvasElement;
    cx: CanvasRenderingContext2D | any; //remove any
    flipPlayer: boolean = false;
    viewport: any; // shall write the interface

    syncState: (state: State) => void;
    updateViewport: (state: State) => void;
    clearDisplay: (status: any) => void; //remove status

    drawBackground: (level: Level) => void;
    drawPlayer: (player: Player, x: number, y: number, width: number, height: number) => void;
    drawActors: (actors: Actor| any)  => void;


    constructor(parent: HTMLElement | any, level: Level) { 
        this.canvas = document.createElement("canvas");
        this.canvas.width = Math.min(600, level.width * SCALE );
        this.canvas.height = Math.min(450, level.width * SCALE );
        parent.appendChild(this.canvas);
        
        this.cx = this.canvas.getContext("2d");
        this.viewport = { 
            left: 0,
            top: 0,
            width: this.canvas.width / SCALE,
            height: this.canvas.height / SCALE
        };
    }

    clear() {
        this.canvas.remove();
    }
}

CanvasDisplay.prototype.syncState = function(state: State) {
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
};

CanvasDisplay.prototype.updateViewport = function(state: State) {
    let view = this.viewport, margin = view.width / 3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + margin) 
        view.left = Math.max(center.x - margin, 0);
    else if (center.x > view.left + view.width - margin) 
        view.left = Math.min(center.x + margin - view.width, state.level.width - view.width);
    if (center.y < view.top + margin) 
        view.top = Math.max(center.y - margin, 0);
    else if (center.y > view.top + view.height - margin) 
        view.top = Math.min(center.y + margin - view.height, state.level.height - view.height);
};

CanvasDisplay.prototype.clearDisplay = function(status: string) { 
    if (status == "won") 
        this.cx.fillStyle = "rgb(68, 191, 255)";
    else if (status == "lost") 
        this.cx.fillStyle = "rgb(44, 136, 214)";

    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasDisplay.prototype.drawPlayer = function(player: Player, x: number, y: number, width: number, height: number) {
  width += playerXOverlap * 2;
  x-= playerXOverlap;
  if (player.speed.x != 0) 
    this.flipPlayer = player.speed.x < 0;
  let tile = 8;
  if (player.speed.y != 0) 
    tile = 9;
  else if (player.speed.x != 0)
    tile = Math.floor(Date.now() / 60) % 8;
  this.cx.save();

  if (this.flipPlayer)
    flipHorizontally(this.cx, x + (width / 2))
  let tileX = tile * width;
  this.cx.drawImage(playerSprite, tileX, 0, width, height,
                                   x,     y, width, height);
  this.cx.restore();
};

CanvasDisplay.prototype.drawActors = function(actors: Array<Actor> | any) {
    for (let actor of actors) {
        let width = actor.size.x * SCALE;
        let height = actor.size.y * SCALE;
        let x = (actor.pos.x - this.viewport.left) * SCALE;
        let y = (actor.pos.y - this.viewport.top) * SCALE;

        if  (actor.type == "player")
            this.drawPlayer(actor, x, y, width, height);
        else {
            let tileX = (actor.type == "coin" ? 2 : 1) * SCALE;
            this.cx.drawImage(otherSprites,
                              tileX, 0, width, height,
                              x,     y, width, height);
        }
    }
};

CanvasDisplay.prototype.drawBackground = function(level: Level) { 
    let {left, top, width, height} = this.viewport;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) { 
            let tile = level.rows[y][x];
            if (tile == "empty")
                continue;
            let screenX = (x - left) * SCALE;
            let screenY = (y - top) * SCALE;
            let tileX = tile == "lava" ? SCALE: 0;
            this.cx.drawImage(otherSprites,
                                tileX,         0, SCALE, SCALE,
                                screenX, screenY, SCALE, SCALE)

        }
    }

}

export default CanvasDisplay;