import Level from "../Level";
import { Actor } from "../types";
import { overlap } from "../helpers";


class State  {
  level: Level;
  actors: Array<Actor> | any;
  status: string;

  update: (time: any, keys: any) => void;

  constructor(level: Level, actors: Array<any>, status: any) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level: Level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
   return this.actors.find(a => a.type == "player");
  }
};

State.prototype.update = function(time, keys) { 
  let actors = this.actors.map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") 
    return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) 
    return new State(this.level, actors, "lost");

  for (let actor of actors) { 
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};


export default State;
