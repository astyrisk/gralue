import Level from "../Level";
import { elt, drawActors, drawGrid } from "../helpers";
import State from "./State";


const scale = 20;

class DOMDisplay {
    dom: HTMLDivElement | any;
    actorLayer: any;

    scrollPlayerIntoView: (state: any) => void;
    syncState: (state: State) => void;

    constructor(parent: HTMLElement, level: Level) {
        this.dom = elt("div", {class: "game"}, drawGrid(level));
        this.actorLayer = null;
        parent.appendChild(this.dom);
    }

    clear() { 
        this.dom.remove();
    }
}


DOMDisplay.prototype.syncState = function(state: State) { 
    if (this.actorLayer)
        this.actorLayer.remove();

    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
};

//TODO CHECK
DOMDisplay.prototype.scrollPlayerIntoView = function(state: State) {
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3; 

    let left = this.dom.scrollLeft, right = left + width;
    let top = this.dom.scrollTop, bottom = top + height;

    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5)).times(scale);

    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }
    
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin -height;
    }
};



export default DOMDisplay;