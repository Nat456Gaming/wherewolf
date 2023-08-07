const roles_file = [
    ["loup","loup","loup","villageois","loup","villageois","loup","villageois","loup","villageois","voyante","voleur","sorciere","cupidon","petite_fille","loup","villageois","loup","villageois","loup","villageois","loup","villageois","loup"],
    ["loup","loup","villageois","loup","villageois","loup","villageois","loup","voyante","voleur","sorciere","cupidon","petite_fille","loup","chasseur","ancien","loup","villageois","loup","villageois","loup","villageois","loup","villageois"],
    ["loup","loup","villageois","loup","voyante","voleur","sorciere","cupidon","petite_fille","loup","chasseur","ancien","loup","villageois","salvateur","idiot","loup_blanc","bouc_emissaire","corbeau","ankou","sectaire","comedien"],
]

const roles_names = {
    loup : "Loup-Garou",
    loup_infecte : "Infecte père des loups",
    loup_blanc : "Loup Blanc",
    villageois : "Villageois",
    voyante : "Voyante",
    voleur : "Voleur",
    sorciere : "Sorcière",
    cupidon : "Cupidon",
    petite_fille : "Petite fille",
    chasseur : "Chasseur",
    ancien : "Ancien du Village",
    garde : "Garde",
    servante : "Servante dévouée",
    enfant : "Enfant sauvage",
    amoureux : "Amoureux"
}

const roles_order = ["cupidon","amoureux","enfant","garde","voyante","loup","loup_infecte","loup_blanc","sorcière"]

const roles_action = {
    cupidon : {
        once_a_game : true,
        color : "pink",
        selected : player => {return false},
        done : player => {return false},
        killed : () => {return false;}
    },
    amoureux : {
        selected : player => {return false},
        done : player => {return false},
        killed : () => {return false;}
    },
    enfant : {
        once_a_game : true,
        color : "red",
        selected : player => game.selected[0] = (game.selected[0] == player) ? false : player,
        done : player => players[getElementPos("enfant")].role_settings = player,
        killed : () => {return false;}
    },
    garde : {
        color : "green",
        selected : player => game.selected[0] = (game.selected[0] == player || players[getElementPos("loup_infecte")].role_settings == player) ? false : player,
        done : player => {players[player-1].is_protected = true, players[getElementPos("loup_infecte")].role_settings = player;},
        killed : () => {return false;}
    },
    voyante : {
        selected : player => {if(! game.selected[0]){game.selected[0] = player; return_card(player);}},
        done : player => {return false},
        killed : () => {return false;}
    },
    loup : {
        color : "red",
        selected : player => game.selected[0] = (game.selected[0] == player) ? false : player,
        done : player => players[player-1].is_killed = true,
        killed : () => {return false;}
    },
    loup_infecte : {
        color : "brown",
        selected : player => {if (players[player-1].is_killed && players[getElementPos("loup_infecte")].role_settings != "done") game.selected[0] = (game.selected[0] == player) ? false : player},
        done : player => {players[player-1] = {is_killed : false, is_infected : true}; players[getElementPos("loup_infecte")].role_settings = "done";},
        killed : () => {return false;}
    },
    loup_blanc : {
        color : "red",
        selected : player => game.selected[0] = (game.selected[0] == player) ? false : player,
        done : player => players[player-1].is_killed = true,
        killed : () => {return false;}
    },
    sorciere : {
        color : "red",
        selected : player => {return false},
        done : player => {return false},
        killed : () => {return false;}
    },
}