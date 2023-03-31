import { levelChars, Vector } from "./types";

class Level {
    //@Actor class instead of any
    height: number; 
    width: number;
    startActors: Array<any>;
    rows: Array<any>;
    touches: (pos: any, size: any, type: any) => boolean;
    constructor(plan: string) {
        let rows = plan.trim().split("\n").map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if (typeof type == "string") return type;
                this.startActors.push(type.create(new Vector(x, y), ch));
                return "empty";
            });
        });
    }
}

Level.prototype.touches = function(pos: Vector, size: Vector, type: string) {
    let xStart = Math.floor(pos.x);
    let yStart = Math.floor(pos.y);
    let xEnd = Math.ceil(pos.x + size.x);
    let yEnd = Math.ceil(pos.y + size.y);
 
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            let isOutside = x < 0 || x >= this.width || y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if (here == type) return true;
        }
    }
    return false;
}

export default Level;