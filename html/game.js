let game_update_trig = 0;

let players = [];
let roles = [];
let game = [];

function game_update(){
    auto_update.forEach(variable => eval(`if (JSON.stringify(${variable}) != getCookie("${variable}") && ${variable} != "" ) setCookie("${variable}",JSON.stringify(${variable}));`));
    if(game.step == 1){
        document.querySelectorAll('.img-back').forEach(image => image.style.border = "");
        game.selected.forEach(selected => {
            if (selected) document.getElementById("img_player"+selected).style.border = "solid "+ roles_action[game.current_role].color +" 5px";
        })
    }
}

async function start(){
    document.getElementById("center_button").style.display = "block";
    if (game.step == 0) game.selected = [];
    game_update_trig = setInterval(() => game_update(), 100);
    while (! is_game_finished()){
        if (game.step == 0){ // ------beginning------
            create_reverse();
            await waitUntil(() => (game.step == 1));
            document.querySelectorAll('.role-img').forEach(e => e.remove());
        }
        if(game.step == 1){ // ------night------
            console.log("Le village s'endors");
            daytime();
            let old_role = game.current_role;
            for (let nb in roles_order) {
                let role = roles_order[nb]
                if (((old_role && old_role == role) || ! old_role) && roles.current.includes(role)){
                    old_role = false;
                    game.current_role = role;
                    document.getElementById("center_button").style.display = "block";
                    console.log("Le.s "+roles_names[role]+" se réveille.nt");
                    await waitUntil(() => (document.getElementById("center_button").style.display == "none")); // when time for the role ends
                    console.log("Le.s "+roles_names[role]+" se rendorme.nt");
                }
            }
            game.current_role = false;
            game.step = 2;
            console.log("Le village se réveille")
            daytime();
        }
        if(game.step == 2){ // ------morning------
            console.log("... est mort")
            create_reverse();
            await waitUntil(() => (game.step == 3));
            document.querySelectorAll('.role-img').forEach(e => e.remove());
        }
        if(game.step == 3){ // ------vote------
            console.log("Place au vote")
            await waitUntil(() => (game.step == 0));
        }
    }
}

function center_button(){
    switch (game.step){
        case 0:
            if(! game.selected[0]) game.step = 1;
            break;
        case 1:
            game.selected.forEach(selected => {if(selected) roles_action[game.current_role].done(selected);})
            game.selected = [];
            document.getElementById("center_button").style.display = "none";
            break;
        case 2:
            if(! game.selected[0]) game.step = 3;
            break;
        case 3:
            console.log("Nobody has been voted");
            document.getElementById("center_button").style.display = "none";
            game.step = 0;
    }
}

function player_pressed(player){
    switch (game.step){
        case 0:
            return_card(player);
            break;
        case 1:
            roles_action[game.current_role].selected(player);
            break;
        case 2:
            return_card(player);
            break;
        case 3:
            console.log("Player "+player+" has been voted");
    }
}

function create_reverse(){
    players.forEach((player, pos) => {
        let role_img = document.createElement("img");
        role_img.setAttribute("class","role-img");
        role_img.setAttribute("id","role_img"+String(pos+1));
        role_img.src = `images/roles/${player.role}.png`
        document.getElementById("btn_player"+String(pos+1)).prepend(role_img);
    });
}

function return_card(player, dead = false){
    if((game.selected[0] == player || ! game.selected[0] || dead)){
        if (document.getElementById("role_img"+player).style.display == ""){
            document.getElementById("role_img"+player).style.display = "block";
            document.getElementById("img_player"+player).style.display = "none";
            if (!dead) game.selected[0] = player;
        }else{
            document.getElementById("role_img"+player).style.display = "";
            document.getElementById("img_player"+player).style.display = "";
            players[player-1].new_role = false;
            if (!dead) game.selected[0] = false;
        }
    }
}

/**
 * @param {number} nb_player - player to kill
 * @param {boolean} try_married - kill the player married to them (= true)
 * @return {string} The new role of the player
 */
function kill(nb_player, try_married = true){
    let player = players[nb_player-1]
    roles_action[player.role].killed()
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

/**
 * @param {string} newrole - to test with an other role
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

function game_end(winner){
    if (winner){
        console.log(winner+" ont gagnés !");
    }else return ;
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

/**
 * @param {object} list - input array
 * @return {} A random object in the array
 */
function random(list){
    return list[Math.floor(Math.random()*list.length)];
}

/**
 * @param {string} value - value to find
 * @param {object} object - object to search in (= players)
 * @param {string} variable - variable that need to be checked (= role)
 * @return {} index of the element
 */
function getElementPos(value, object=players, variable="role"){
    return object.findIndex(item => item[variable] == value)
}