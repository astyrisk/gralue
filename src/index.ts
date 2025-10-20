import Level from "./Level";
import State from "./components/State";
import CanvasDisplay from "./components/CanvasDisplay";
import GAME_LEVEL from "./media/level"
import { deepStrictEqual } from "assert";
import githubImagePath from "../assets/github.png";


const levelHeader = document.querySelector(".level");
const lifeHeader = document.querySelector(".lifes");
const statDiv = document.querySelector(".stat");

if (statDiv) {
    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/astyrisk/gralue";
    const githubImage = document.createElement("img");
    githubImage.src = githubImagePath;
    githubImage.style.width = "48px";
    githubImage.style.height = "48px";
    githubLink.appendChild(githubImage);
    statDiv.appendChild(githubLink);
}

function runAnimation(frameFunc: Function) { 
    let lastTime: number | null = null;
    function frame(time: number | null) { 
        if (lastTime != null) { 
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            if (frameFunc(timeStep) === false)
                return;
        }
        lastTime = time;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}


function runLevel(level: Level, Display: CanvasDisplay | any, levelNumber: number, triesNumber: number) {
    let display = new Display(document.body, level);
    display.level = levelNumber;
    display.tries = triesNumber;
    let state: State | any = State.start(level)  ;
    let ending: number = 1;
    let running: string = "yes";

    return new Promise( resolve => { 
        function escHandler(event: KeyboardEvent) { 
            if (event.key != "Escape") return;
            event.preventDefault();
            if (running == "no") { 
                running = "yes"; 
                runAnimation(frame);
            } else if (running == "yes") { 
                running = "pausing";
            } else {
                running = "yes";
            }
        }
        window.addEventListener("keydown", escHandler);
        let arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

        function frame(time: number | null){ 
            if (running == "pausing") {
                running = "no";
                return false;
            }
            state = state.update(time, arrowKeys);
            display.syncState(state);

            if(state.status == "playing") { 
                return true;
            } else if (ending > 0) { 
                ending -= time;
                return true;
            } else { 
                display.clear();
                window.removeEventListener("keydown", escHandler);
                arrowKeys.unregister();
                resolve(state.status);
                return false;
            }
        }
        runAnimation(frame);
    });
}

function trackKeys(keys: any) {
    let down = Object.create(null);
    function track(event: any) { 
        if (keys.includes(event.key)) { 
            down[event.key] = event.type == "keydown";
            event.preventDefault();
        }
    }
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    down.unregister = () => { 
        window.removeEventListener("keydown", track);
        window.removeEventListener("keyup", track);
    };
    return down;
}

async function runGame(plans: Array<string>, Display: CanvasDisplay | any) {
    let MAX = 2, level = 0;
    while (level < plans.length) {
        let status = await runLevel(new Level(plans[level]), Display, level, MAX);
        if (status == 'won') {
            level++;
        }
        else if (MAX > 0) {
            --MAX;
        }
        else {
            console.log("GAME OVER");
            level = 0;
            MAX = 2;
        }
    }
    console.log("YOU HAVE WON!");
}


runGame(GAME_LEVEL, CanvasDisplay);
