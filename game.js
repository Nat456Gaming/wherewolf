let step = 0; //0 is beginning, 1 is night, 2 is morning, 3 is vote
let night = "wolf";

function start(){
    step = 0;
}

function center_button(){
    switch (step){
        case 0:
            document.getElementById("center_button").style.display = "none";
            step = 1;
            daytime();
            break;
        case 1:
            //do nothing
            break;
        case 2:
            step = 3;
            break;
        case 3:
            console.log("Nobody has been voted");
            document.getElementById("center_button").style.display = "none";
            step = 1;
    }
}

function player_pressed(player){
    switch (step){
        case 0:
            console.log(players_list[player-1]);
            break;
        case 1:
            switch (night){
                case "wolf":
                    document.getElementById("img_player"+player).style.border = "solid red 5px";
                    break;
            }
            break;
        case 2:
            //do nothing
            break;
        case 3:
            console.log("Player "+player+" has been voted");
            step = 1;
    }
}

/**
 * @return {string} Return who won (false if nobody)
 */
function is_game_finished(newrole = false){
    let village_winning = true;
    let wolves_winning = true;
    let alive = [];
    players_list.forEach(player => {
        if (player.role == "wolf" || player.is_infected) village_winning = false;
        else if (player.role) wolves_winning = false;
        if (player.role) alive.push(player.name);
    });
    if (newrole){
        if (newrole == "wolf") village_winning = false;
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
    let player = players_list[nb_player-1]
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
        role = random(current_roles);
        if ((! is_game_finished(role)) || beginning){
            current_roles.splice(current_roles.indexOf(role), 1);
            return role;
        }
    }
    return false;
}

function daytime(time = step){
    if(time == 1){
        document.documentElement.style.setProperty('--foreground-color', "white");
        document.documentElement.style.setProperty('--background-color', "black");
    }else{
        document.documentElement.style.setProperty('--foreground-color', "black");
        document.documentElement.style.setProperty('--background-color', "white");
    }
}