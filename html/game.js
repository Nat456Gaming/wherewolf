let game_update_trig = 0;

let players = [];
let roles = [];
let game = [];

function game_update(){
    auto_update.forEach(variable =>{
        eval(`if (JSON.stringify(${variable}) != getCookie("${variable}") && ${variable} != "" ) setCookie("${variable}",JSON.stringify(${variable}));`);
    });
    if(game.step == 1){
        if (game.selected){
            document.querySelectorAll('.img-back').forEach(image => image.style.border = "");
            document.getElementById("img_player"+game.selected).style.border = "solid red 5px";
        }
    }
}

async function start(){
    if (game.step = 0) game.selected = false;
    game_update_trig = setInterval(() => game_update(), 100);
    while (! is_game_finished()){
        players.forEach((player, pos) => {
            let role_img = document.createElement("img");
            role_img.setAttribute("class","role-img");
            role_img.setAttribute("id","role_img"+String(pos+1));
            role_img.src = `images/roles/${player.role}.png`
            document.getElementById("btn_player"+String(pos+1)).prepend(role_img);
        });
        document.getElementById("center_button").style.display = "block";
        await waitUntil(() => ("123".includes(game.step)));
        document.getElementById("center_button").style.display = "none";
        daytime();
        console.log("nuit:"+game.step)
        await waitUntil(() => (game.step == 2));
    }
}

function center_button(){
    switch (game.step){
        case 0:
            if(! game.selected) game.step = 1;
            break;
        case 1:
            //do nothing
            break;
        case 2:
            game.step = 3;
            break;
        case 3:
            console.log("Nobody has been voted");
            document.getElementById("center_button").style.display = "none";
            game.step = 1;
    }
}

function player_pressed(player){
    switch (game.step){
        case 0:
            return_card(player);
            break;
        case 1:
            /*switch (game.night){
                case "loup":
                    game.selected = player;
                    //players[player-1].is_killed = true;
                    break;
            }*/
            //faudra utilise role_order
            role_action[game.night](game);
            break;
        case 2:
            //do nothing
            break;
        case 3:
            console.log("Player "+player+" has been voted");
            game.step = 1;
    }
}

function return_card(player){
    if((game.selected == player || ! game.selected)){
        if (document.getElementById("role_img"+player).style.display == ""){
            document.getElementById("role_img"+player).style.display = "block";
            document.getElementById("img_player"+player).style.display = "none";
            game.selected = player;
        }else{
            document.getElementById("role_img"+player).style.display = "";
            document.getElementById("img_player"+player).style.display = "";
            game.selected = false;
        }
    }
}

/**
 * @return {string} Return who won (false if nobody)
 */
function is_game_finished(newrole = false){
    let village_winning = true;
    let wolves_winning = true;
    let alive = [];
    players.forEach(player => {
        if (String(player.role).includes("loup") || player.is_infected) village_winning = false;
        else if (player.role) wolves_winning = false;
        if (player.role) alive.push(player.name);
    });
    if (newrole){
        if (newrole.includes("loup")) village_winning = false;
        else wolves_winning = false;
    }
    if (alive.length == 1) return alive[0];
    if (village_winning) return "village";
    if (wolves_winning) return "wolves";
    return false;
}

/**
 * @param {number} nb_player - player to kill
 * @param {boolean} try_married - kill the player married to them (true)
 * @return {string} The new role of the player
 */
function kill(nb_player, try_married = true){
    let player = players[nb_player-1]
    player.is_infected = false;
    if (player.lifes > 0){
        player.lifes --;
        player.role = give_role();
        if (player.role) player.new_role = true;
    }else player.role = false;
    game_end(is_game_finished());
    if (player.married_to){
        if (try_married) kill(player.married_to,false);
        player.married_to = 0
    }
    return player.role;
}

function game_end(winner){
    if (winner){
        console.log(winner+" ont gagnés !");
    }else return ;
}

/**
 * @param {object} list - input array
 * @return {} A random object in the array
 */
function random(list){
    return list[Math.floor(Math.random()*list.length)];
}

function give_role(beginning = false){
    let role = "";
    for (let i = 0; i <= 30; i++){
        role = random(roles.remaining);
        if ((! is_game_finished(role)) || beginning){
            roles.remaining.splice(roles.remaining.indexOf(role), 1);
            return role;
        }
    }
    return false;
}

function daytime(time = game.step){
    if(time == 1){
        document.documentElement.style.setProperty('--foreground-color', "white");
        document.documentElement.style.setProperty('--background-color', "black");
    }else{
        document.documentElement.style.setProperty('--foreground-color', "");
        document.documentElement.style.setProperty('--background-color', "");
    }
}

const waitUntil = (condition, checkInterval=100) => {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            if (!condition()) return;
            clearInterval(interval);
            resolve();
        }, checkInterval)
    })
}