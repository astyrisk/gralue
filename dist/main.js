(()=>{"use strict";class t{constructor(t,e,n){this.level=t,this.actors=e,this.status=n}static start(e){return new t(e,e.startActors,"playing")}get player(){return this.actors.find((t=>"player"==t.type))}}t.prototype.update=function(e,n){let s=this.actors.map((t=>t.update(e,this,n))),o=new t(this.level,s,this.status);if("playing"!=o.status)return o;let i=o.player;if(this.level.touches(i.pos,i.size,"lava"))return new t(this.level,s,"lost");for(let t of s)t!=i&&(l=i,(r=t).pos.x+r.size.x>l.pos.x&&r.pos.x<l.pos.x+l.size.x&&r.pos.y+r.size.y>l.pos.y&&r.pos.y<l.pos.y+l.size.y)&&(o=t.collide(o));var r,l;return o};const e=t;class n{constructor(t,e){this.x=t,this.y=e}plus(t){return new n(this.x+t.x,this.y+t.y)}times(t){return new n(this.x*t,this.y*t)}}class s{constructor(t,e){this.pos=t,this.speed=e}get type(){return"player"}static create(t){return new s(t.plus(new n(0,-.5)),new n(0,0))}update(t,e,o){let i=0;o.ArrowLeft&&(i-=7),o.ArrowRight&&(i+=7);let r=this.pos,l=r.plus(new n(i*t,0));e.level.touches(l,this.size,"wall")||(r=l);let a=this.speed.y+30*t,h=r.plus(new n(0,a*t));return e.level.touches(h,this.size,"wall")?o.ArrowUp&&a>0?a-=17:a=0:r=h,new s(r,new n(i,a))}}class o{constructor(t,e,n){this.pos=t,this.speed=e,null!=n&&(this.reset=n)}get type(){return"lava"}static create(t,e){switch(e){case"=":return new o(t,new n(2,0),null);case"|":return new o(t,new n(0,2),null);case"v":return new o(t,new n(0,3),t)}}collide(t){return new e(t.level,t.actors,"lost")}update(t,e){let n=this.pos.plus(this.speed.times(t));return e.level.touches(n,this.size,"wall")?this.reset?new o(this.reset,this.speed,this.reset):new o(this.pos,this.speed.times(-1),null):new o(n,this.speed,this.reset)}}class i{constructor(t,e,n){this.pos=t,this.basePos=e,this.wobble=n}get type(){return"coin"}static create(t){let e=t.plus(new n(.2,.1));return new i(e,e,Math.random()*Math.PI*2)}collide(t){let n=t.actors.filter((t=>t!=this)),s=t.status;return n.some((t=>"coin"==t.type))||(s="won"),new e(t.level,n,s)}update(t){let e=this.wobble+8*t,s=.07*Math.sin(e);return new i(this.basePos.plus(new n(0,s)),this.basePos,e)}}class r{constructor(t){this.pos=t}static create(t){return new r(t.plus(new n(0,-1)))}update(t,e){let s=(e.player.pos.x<this.pos.x?-1:1)*t*4,o=new n(this.pos.x+s,this.pos.y);return e.level.touches(o,this.size,"wall")?this:new r(o)}collide(t){let n=t.player;if(n.pos.y+n.size.y<this.pos.y+.5){let n=t.actors.filter((t=>t!=this));return new e(t.level,n,t.status)}return new e(t.level,t.actors,"lost")}}s.prototype.size=new n(.8,1.5),o.prototype.size=new n(1,1),i.prototype.size=new n(.6,.6),r.prototype.size=new n(1.2,2);class l{constructor(t,e){this.x=t,this.y=e}plus(t){return new l(this.x+t.x,this.y+t.y)}times(t){return new l(this.x*t,this.y*t)}}var a={".":"empty","#":"wall","+":"lava","@":s,o:i,"=":o,"|":o,v:o,M:r};class h{constructor(t){let e=t.trim().split("\n").map((t=>[...t]));this.height=e.length,this.width=e[0].length,this.startActors=[],this.rows=e.map(((t,e)=>t.map(((t,n)=>{let s=a[t];return"string"==typeof s?s:(this.startActors.push(s.create(new l(n,e),t)),"empty")}))))}}h.prototype.touches=function(t,e,n){let s=Math.floor(t.x),o=Math.floor(t.y),i=Math.ceil(t.x+e.x),r=Math.ceil(t.y+e.y);for(let t=o;t<r;t++)for(let e=s;e<i;e++)if((e<0||e>=this.width||t<0||t>=this.height?"wall":this.rows[t][e])==n)return!0;return!1};const c=h,p=20;let u=document.createElement("img"),w=document.createElement("img");w.src="./player.png",u.src="./sprites.png";class y{constructor(t,e){this.flipPlayer=!1,this.canvas=document.createElement("canvas"),this.canvas.width=Math.min(600,e.width*p),this.canvas.height=Math.min(450,e.width*p),t.appendChild(this.canvas),this.cx=this.canvas.getContext("2d"),this.viewport={left:0,top:0,width:this.canvas.width/p,height:this.canvas.height/p}}clear(){this.canvas.remove()}}y.prototype.syncState=function(t){this.updateViewport(t),this.clearDisplay(t.status),this.drawBackground(t.level),this.drawActors(t.actors)},y.prototype.updateViewport=function(t){let e=this.viewport,n=e.width/3,s=t.player,o=s.pos.plus(s.size.times(.5));o.x<e.left+n?e.left=Math.max(o.x-n,0):o.x>e.left+e.width-n&&(e.left=Math.min(o.x+n-e.width,t.level.width-e.width)),o.y<e.top+n?e.top=Math.max(o.y-n,0):o.y>e.top+e.height-n&&(e.top=Math.min(o.y+n-e.height,t.level.height-e.height))},y.prototype.clearDisplay=function(t){"won"==t?this.cx.fillStyle="rgb(68, 191, 255)":"lost"==t&&(this.cx.fillStyle="rgb(44, 136, 214)"),this.cx.fillRect(0,0,this.canvas.width,this.canvas.height)},y.prototype.drawPlayer=function(t,e,n,s,o){s+=8,e-=4,0!=t.speed.x&&(this.flipPlayer=t.speed.x<0);let i=8;var r,l;0!=t.speed.y?i=9:0!=t.speed.x&&(i=Math.floor(Date.now()/60)%8),this.cx.save,this.flipPlayer&&(l=e+s/2,(r=this.cx).translate(l,0),r.scale(-1,1),r.translate(-l,0));let a=i*s;this.cx.drawImage(w,a,0,s,o,e,n,s,o),this.cx.restore()},y.prototype.drawActors=function(t){for(let e of t){let t=e.size.x*p,n=e.size.y*p,s=(e.pos.x-this.viewport.left)*p,o=(e.pos.y-this.viewport.top)*p;if("player"==e.type)this.drawPlayer(e,s,o,t,n);else{let i=(e.type,40);this.cx.drawImage(u,i,0,t,n,s,o,t,n)}}},y.prototype.drawBackground=function(t){let{left:e,top:n,width:s,height:o}=this.viewport,i=Math.floor(e),r=Math.ceil(e+s),l=Math.floor(n),a=Math.ceil(n+o);for(let s=l;s<a;s++)for(let o=i;o<r;o++){let i=t.rows[s][o];if("empty"==i)continue;let r=(o-e)*p,l=(s-n)*p,a="lava"==i?p:0;this.cx.drawImage(u,a,0,p,p,r,l,p,p)}};const d=y;function f(t){let e=null;requestAnimationFrame((function n(s){if(null!=e){let n=Math.min(s-e,100)/1e3;if(!1===t(n))return}e=s,requestAnimationFrame(n)}))}function v(t,n){let s=new n(document.body,t),o=e.start(t),i=1,r="yes";return new Promise((t=>{function e(t){"Escape"==t.key&&(t.preventDefault(),"no"==r?(r="yes",f(l)):r="yes"==r?"pausing":"yes")}window.addEventListener("keydown",e);let n=function(t){let e=Object.create(null);function n(n){t.includes(n.key)&&(e[n.key]="keydown"==n.type,n.preventDefault())}return window.addEventListener("keydown",n),window.addEventListener("keyup",n),e.unregister=()=>{window.removeEventListener("keydown",n),window.removeEventListener("keyup",n)},e}(["ArrowLeft","ArrowRight","ArrowUp"]);function l(l){return"pausing"==r?(r="no",!1):(o=o.update(l,n),s.syncState(o),"playing"==o.status||(i>0?(i-=l,!0):(s.clear(),window.removeEventListener("keydown",e),n.unregister(),t(o.status),!1)))}f(l)}))}console.log("helloooooooooooooooooo"),function(t,e){var n,s,o,i;n=this,s=void 0,i=function*(){let n=3,s=0;for(;s<t.length;)"won"==(yield v(new c(t[s]),e))?s++:n>0?console.log("You have ",--n," tries left!"):(console.log("GAME OVER"),s=0,n=3);console.log("YOU HAVE WON!")},new((o=void 0)||(o=Promise))((function(t,e){function r(t){try{a(i.next(t))}catch(t){e(t)}}function l(t){try{a(i.throw(t))}catch(t){e(t)}}function a(e){var n;e.done?t(e.value):(n=e.value,n instanceof o?n:new o((function(t){t(n)}))).then(r,l)}a((i=i.apply(n,s||[])).next())}))}(["                                                    \n................................................................................\n................................................................................\n................................................................................\n................................................................................\n................................................................................\n................................................................................\n..................................................................###...........\n...................................................##......##....##+##..........\n....................................o.o......##..................#+++#..........\n.................................................................##+##..........\n...................................#####..........................#v#...........\n............................................................................##..\n..##......................................o.o................................#..\n..#.....................o....................................................#..\n..#......................................#####.............................o.#..\n..#..........####.......o....................................................#..\n..#..@.......#..#................................................#####.......#..\n..############..###############...####################.....#######...#########..\n..............................#...#..................#.....#....................\n..............................#+++#..................#+++++#....................\n..............................#+++#..................#+++++#....................\n..............................#####..................#######....................\n................................................................................\n................................................................................\n","                                                                     \n................................................................................\n................................................................................\n....###############################.............................................\n...##.............................##########################################....\n...#.......................................................................##...\n...#....o...................................................................#...\n...#................................................=.......................#...\n...#.o........################...................o..o...........|........o..#...\n...#.........................#..............................................#...\n...#....o....................##########.....###################....##########...\n...#..................................#+++++#.................#....#............\n...###############....oo......=o.o.o..#######.###############.#....#............\n.....#...............o..o.............#.......#......#........#....#............\n.....#....................#############..######.####.#.########....########.....\n.....#.............########..............#...........#.#..................#.....\n.....#..........####......####...#####################.#..................#.....\n.....#........###............###.......................########....########.....\n.....#.......##................#########################......#....#............\n.....#.......#................................................#....#............\n.....###......................................................#....#............\n.......#...............o...........................................#............\n.......#...............................................o...........#............\n.......#########......###.....############.........................##...........\n.............#..................#........#####....#######.o.........########....\n.............#++++++++++++++++++#............#....#.....#..................#....\n.............#++++++++++++++++++#..........###....###...####.o.............#....\n.............####################..........#........#......#.....|.........#....\n...........................................#++++++++#......####............#....\n...........................................#++++++++#.........#........@...#....\n...........................................#++++++++#.........##############....\n...........................................##########...........................\n................................................................................\n","\n......................................#++#........................#######....................................#+#..\n......................................#++#.....................####.....####.................................#+#..\n......................................#++##########...........##...........##................................#+#..\n......................................##++++++++++##.........##.............##...............................#+#..\n.......................................##########++#.........#....................................o...o...o..#+#..\n................................................##+#.........#.....o...o....................................##+#..\n.................................................#+#.........#................................###############++#..\n.................................................#v#.........#.....#...#........................++++++++++++++##..\n.............................................................##..|...|...|..##............#####################...\n..............................................................##+++++++++++##............v........................\n...............................................................####+++++####......................................\n...............................................#.....#............#######........###.........###..................\n...............................................#.....#...........................#.#.........#.#..................\n...............................................#.....#.............................#.........#....................\n...............................................#.....#.............................##........#....................\n...............................................##....#.............................#.........#....................\n...............................................#.....#......o..o.....#...#.........#.........#....................\n...............#######........###...###........#.....#...............#...#.........#.........#....................\n..............##.....##.........#...#..........#.....#.....######....#...#...#########.......#....................\n.............##.......##........#.o.#..........#....##...............#...#...#...............#....................\n.....@.......#.........#........#...#..........#.....#...............#...#...#...............#....................\n....###......#.........#........#...#..........#.....#...............#...#####...######......#....................\n....#.#......#.........#.......##.o.##.........#.....#...............#.....o.....#.#.........#....................\n++++#.#++++++#.........#++++++##.....##++++++++##....#++++++++++.....#.....=.....#.#.........#....................\n++++#.#++++++#.........#+++++##.......##########.....#+++++++##+.....#############.##..o.o..##....................\n++++#.#++++++#.........#+++++#....o.................##++++++##.+....................##.....##.....................\n++++#.#++++++#.........#+++++#.....................##++++++##..+.....................#######......................\n++++#.#++++++#.........#+++++##.......##############++++++##...+..................................................\n++++#.#++++++#.........#++++++#########++++++++++++++++++##....+..................................................\n++++#.#++++++#.........#++++++++++++++++++++++++++++++++##.....+..................................................\n","\n..............................................................................................................\n..............................................................................................................\n..............................................................................................................\n..............................................................................................................\n..............................................................................................................\n........................................o.....................................................................\n..............................................................................................................\n........................................#.....................................................................\n........................................#.....................................................................\n........................................#.....................................................................\n........................................#.....................................................................\n.......................................###....................................................................\n.......................................#.#.................+++........+++..###................................\n.......................................#.#.................+#+........+#+.....................................\n.....................................###.###................#..........#......................................\n......................................#...#.................#...oooo...#.......###............................\n......................................#...#.................#..........#......#+++#...........................\n......................................#...#.................############.......###............................\n.....................................##...##......#...#......#................................................\n......................................#...#########...########..............#.#...............................\n......................................#...#...........#....................#+++#..............................\n......................................#...#...........#.....................###...............................\n.....................................##...##..........#.......................................................\n......................................#...#=.=.=.=....#............###........................................\n......................................#...#...........#...........#+++#.......................................\n......................................#...#....=.=.=.=#.....o......###.......###..............................\n.....................................##...##..........#.....................#+++#.............................\n..............................o...o...#...#...........#.....#................##v........###...................\n......................................#...#...........#..............#.................#+++#..................\n.............................###.###.###.###.....o.o..#++++++++++++++#...................v#...................\n.............................#.###.#.#.###.#..........#++++++++++++++#........................................\n.............................#.............#...#######################........................................\n.............................##...........##.........................................###......................\n..###.........................#.....#.....#.........................................#+++#................###..\n..#.#.........................#....###....#..........................................###.................#.#..\n..#...........................#....###....#######........................#####.............................#..\n..#...........................#...........#..............................#...#.............................#..\n..#...........................##..........#..............................#.#.#.............................#..\n..#.......................................#.......|####|....|####|.....###.###.............................#..\n..#................###.............o.o....#..............................#.........###.....................#..\n..#...............#####.......##..........#.............................###.......#+++#..........#.........#..\n..#...............o###o.......#....###....#.............................#.#........###..........###........#..\n..#................###........#############..#.oo.#....#.oo.#....#.oo..##.##....................###........#..\n..#......@..........#.........#...........#++#....#++++#....#++++#....##...##....................#.........#..\n..#############################...........#############################.....################################..\n..............................................................................................................\n..............................................................................................................\n","\n..................................................................................................###.#.......\n......................................................................................................#.......\n..................................................................................................#####.......\n..................................................................................................#...........\n..................................................................................................#.###.......\n..........................o.......................................................................#.#.#.......\n.............................................................................................o.o.o###.#.......\n...................###................................................................................#.......\n.......+..o..+................................................#####.#####.#####.#####.#####.#####.#####.......\n.......#.....#................................................#...#.#...#.#...#.#...#.#...#.#...#.#...........\n.......#=.o..#............#...................................###.#.###.#.###.#.###.#.###.#.###.#.#####.......\n.......#.....#..................................................#.#...#.#...#.#...#.#...#.#...#.#.....#.......\n.......+..o..+............o..................................####.#####.#####.#####.#####.#####.#######.......\n..............................................................................................................\n..........o..............###..............................##..................................................\n..............................................................................................................\n..............................................................................................................\n......................................................##......................................................\n...................###.........###............................................................................\n..............................................................................................................\n..........................o.....................................................#......#......................\n..........................................................##.....##...........................................\n.............###.........###.........###.................................#..................#.................\n..............................................................................................................\n.................................................................||...........................................\n..###########.................................................................................................\n..#.........#.o.#########.o.#########.o.##................................................#...................\n..#.........#...#.......#...#.......#...#.................||..................#.....#.........................\n..#..@......#####...o...#####...o...#####.....................................................................\n..#######.....................................#####.......##.....##.....###...................................\n........#=..................=................=#...#.....................###...................................\n........#######################################...#+++++++++++++++++++++###+++++++++++++++++++++++++++++++++++\n..................................................############################################################\n..............................................................................................................\n"],d);var m=document.getElementsByTagName("head")[0],g=document.createElement("link");g.rel="stylesheet",g.type="text/css",g.href="style.css",g.media="all",m.appendChild(g)})();