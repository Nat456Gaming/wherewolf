const roles_file = [
    ["loup","loup","loup","villageois","loup","villageois","loup","villageois","loup","villageois","voyante","voleur","sorciere","cupidon","petite_fille","loup","villageois","loup","villageois","loup","villageois","loup","villageois","loup"],
    ["loup","loup","villageois","loup","villageois","loup","villageois","loup","voyante","voleur","sorciere","cupidon","petite_fille","loup","chasseur","ancien","loup","villageois","loup","villageois","loup","villageois","loup","villageois"],
    ["loup","loup","villageois","loup","voyante","voleur","sorciere","cupidon","petite_fille","loup","chasseur","ancien","loup","villageois","salvateur","idiot","loup_blanc","bouc_emissaire","corbeau","ankou","sectaire","comedien"],
]

const roles_order = ["cupidon","enfant","garde","voyante","loup","loup_infecte","loup_blanc","sorciere"];

const role_names = {
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
    servante : "Servante dévouée" 
}

const role_action = {
    loup : (game)=>{
        game.selected = player;
        //players[player-1].is_killed = true;
    },
    loup_infecte : (game)=>{
        //le code
    },
    loup_blanc : (game)=>{
        //le code
    },
    villageois : (game)=>{
        //le code
    },
    voyante : (game)=>{
        //le code
    },
    voleur : (game)=>{
        //le code
    },
    sorciere : (game)=>{
        //le code
    },
    cupidon : (game)=>{
        //le code
    },
    petite_fille : (game)=>{
        //le code
    },
    chasseur : (game)=>{
        //le code
    },
    ancien : (game)=>{
        //le code
    },
    garde : (game)=>{
        //le code
    },
    servante : (game)=>{
        //le code
    },
}