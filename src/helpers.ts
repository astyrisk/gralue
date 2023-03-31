import Level from "./Level";
import { Actor } from "./types";

const scale = 20;

//TODO check
function flipHorizontally(context: CanvasRenderingContext2D , around: number | any) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

function elt(name: string, atts: any, ...children: any) {
  let dom = document.createElement(name);
  for (let att of Object.keys(atts)) 
    dom.setAttribute(att, atts[att]);
  for (let child of children)
    dom.appendChild(child);

  return dom;
}


function drawGrid(level: Level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
  ));
}

// console.log(`${simpleLevel.width} by ${simpleLevel.height}`);

function drawActors(actors ) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}

function overlap(actor1: Actor, actor2: Actor) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}

export {flipHorizontally, elt, drawGrid, drawActors, overlap};