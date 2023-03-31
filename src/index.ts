import Level from "./Level";
import State from "./components/State";
import CanvasDisplay from "./components/CanvasDisplay";
import GAME_LEVEL from "./media/level"

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


function runLevel(level: Level, Display: CanvasDisplay | any) {
    let display = new Display(document.body, level);
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
    let MAX = 3, level = 0;
    while (level < plans.length) { 
        let status = await runLevel(new Level(plans[level]), Display)
        if (status == 'won') level++;
        else if (MAX > 0) console.log("You have ", --MAX, " tries left!");
        else {
            console.log("GAME OVER");
            level = 0;
            MAX = 3;
        }
    }
    console.log("YOU HAVE WON!");
}


runGame(GAME_LEVEL, CanvasDisplay);

