const max_players = 10;
const min_players = 4;

const max_roles = 20;
const min_roles = 0; //normally 8

const auto_update = ["players","roles","game"]

window.onload = () => {
    document.getElementById("game_style").max = roles_file.length;
    if(getCookie("player_number")) document.getElementById('players_number').value = Number(getCookie("player_number"));
    if(getCookie("roles_per_player")) document.getElementById('roles_number').value = Number(getCookie("roles_per_player"));
    if(getCookie("game_style")) document.getElementById('game_style').value = Number(getCookie("game_style"));
    if(! getCookie("player_names")) setCookie("player_names",JSON.stringify([]));
    update();
    if(getCookie("players")){
        auto_update.forEach(variable =>{
            eval(`${variable} = JSON.parse(getCookie("${variable}"));`);
        });
        start_game(true);
    }
    setInterval(() => { update(); }, 100);
};

let old_game_style = 0;
let old_players = 0;
let old_roles = 0;
let old_players_names = [];
let setup_list = [];

function update(){
    auto_update.forEach(variable =>{
        eval(`if (JSON.stringify(${variable}) != getCookie("${variable}") && ${variable} != "" ) setCookie("${variable}",JSON.stringify(${variable}));`);
    });
    let players_nb = document.getElementById('players_number').value;
    let roles_nb = document.getElementById('roles_number').value;
    let game_style = document.getElementById("game_style").value;

    if (players_nb != old_players){
        players_nb = Math.round(players_nb);
        if (players_nb > max_players) players_nb = players_nb % 10;
        if (players_nb < min_players) players_nb = min_players;
        document.getElementById('players_number').value = players_nb;
        old_players = players_nb;
        setCookie("player_number",players_nb);
        if (players_nb*roles_nb < min_roles) document.getElementById('roles_number').value = 2;
        if (players_nb*roles_nb > max_roles) document.getElementById('roles_number').value = 2;

        setup_list = [];
        document.getElementById("players_container").innerHTML = '';
        for (let i = 1; i <= players_nb; i++) {
            let player = document.createElement("input");
            player.setAttribute("type","text");
            player.setAttribute("placeholder","Joueur "+i);
            player.setAttribute("id","player"+i);
            document.getElementById('players_container').appendChild(player);
            setup_list.push("player"+i);
        }
        setup_list.forEach((id,pos) => {
            if (JSON.parse(getCookie("player_names"))[pos]) document.getElementById(id).value = JSON.parse(getCookie("player_names"))[pos];
        })
    }
    
    if (roles_nb != old_roles){
        roles_nb = Math.round(roles_nb);
        if (roles_nb > 3) roles_nb = roles_nb % 3;
        if (players_nb*roles_nb < min_roles) roles_nb = 2;
        if (players_nb*roles_nb > max_roles) roles_nb = 2;
        if (roles_nb < 1) roles_nb = 1;
        document.getElementById('roles_number').value = roles_nb;
        old_roles = roles_nb;
        setCookie("roles_per_player",roles_nb);
    }

    if (game_style != old_game_style){
        setCookie("game_style",game_style);
        old_game_style = game_style;
    }

    setup_list.forEach((id,pos) => {
        let name = document.getElementById(id).value;
        if (name !== old_players_names[pos]){
            if (name.includes(";")){
                document.getElementById(id).value = old_players_names[pos];
                name = old_players_names[pos];
            }
            old_players_names[pos] = name;
            let names = JSON.parse(getCookie("player_names"));
            names[pos] = name;
            setCookie("player_names",JSON.stringify(names));
        }
    });
}

function start_game(reload = false){
    let test = true;
    for (let i = 1; i <= document.getElementById('players_number').value; i++) {
        if (! document.getElementById('player'+i).value) test = false;
    }
    if (test){
        if(! reload){
            let roles_list = roles_file[document.getElementById("game_style").value-1].slice(0,old_roles*old_players)
            roles = {
                current : JSON.parse(JSON.stringify(roles_list)),
                remaining : JSON.parse(JSON.stringify(roles_list))
            }
            players = [];
            for (let i = 1; i <= document.getElementById('players_number').value; i++) {
                let player = {
                    name : String(document.getElementById('player'+i).value),
                    role : give_role(true),
                    new_role : true,
                    lifes : Number(document.getElementById("roles_number").value)-1,
                    role_setting : 0,
                    is_killed : false,
                    is_protected : false,
                    is_infected : false,
                    married_to : Number(false)
                }
                players.push(player);
            }
        }
        for (let i = 1; i <= players.length; i++) create_card(i,players.length);
        document.getElementById("home").style.display = "none";
        document.getElementById("game").style.display = "block";
        start();
    }else alert("Nomme bien tous les joueurs !");
}

function exit(){
    if (confirm("Veux-tu vraiment quitter la partie ?")){
        auto_update.forEach(variable => {
            delCookie(variable);
            eval(`${variable} = [];`)
        });
        document.getElementById("game_player_container").innerHTML = "<!-- PLAYERS CARDS GENERATED IN JS -->";
        document.getElementById("center_button").style.display = "block";
        daytime(0);
        document.getElementById("game").style.display = "none";
        document.getElementById("home").style.display = "block";
    }
}


function create_card(player,total){
    let W = window.innerWidth;
    let H = window.innerHeight;
    /*if (H<W) W = H;
    else H = W;*/
    let card = document.createElement("div");
    card.setAttribute("class","div-btn-player");
    card.style.left = String(window.innerWidth/2 + Math.round(square_coord(player, total, W, H)[0]) - 50)+"px";
    card.style.bottom = String(window.innerHeight/2 + Math.round(square_coord(player, total, W, H)[1]) - 50)+"px";
    card.style.zIndex = player;
    card.style.transform =  "rotate("+String(square_coord(player, total, W, H)[2])+"rad) scale("+String(calc_scale(W,H))+")";
    card.innerHTML ='<button class="btn-player" id="btn_player'+player+'" onclick="player_pressed('+player+')"><img id="img_player'+player+'" src="images/back.png" alt="player N°'+player+'"><h2 class="player-name">'+document.getElementById("player"+String(player)).value+'</h2></button>';
    document.getElementById('game_player_container').appendChild(card);
}

function square_coord(player, total, Width, Height){
    let W = Width;
    let H = Height;
    if (W<=H){
        W = Height;
        H = Width;
    }
    let x = W/Math.round(total/2)*(player-Math.round(total/2)/2-0.5);
    let y = -H/3.5;
    let angle = 0;
    if (player > Math.round(total/2)){
        x = -W/(total-Math.round(total/2))*(player-Math.round(total/2)-(total-Math.round(total/2))/2-0.5);
        y = H/3.5;
        angle = Math.PI;
    }
    if (Width>=Height) return [x,y,angle];
    document.getElementById("center_button").style.transform = "rotate("+String(Math.PI/2)+"rad)";
    return [y,x,angle+Math.PI/2];
}

function calc_scale(W, H){
    return W*H/2061400+5/22;
}

/*
let angle = (Math.PI*2/total)*player;

function circle_coord(angle, W, H){
    let x = Math.cos(angle)*W/3; //*(-10*Math.abs(Math.sin(angle))/125*Math.PI+1)
    let y = Math.sin(angle)*H/3; //*(-10*Math.abs(Math.cos(angle))/125*Math.PI+1)
    return [x,y];
}

function calc_scale(W, H){
    return W*H/2093230+159323/418646
}

function calc_angle(player, total, W = window.innerWidth/2, H = window.innerHeight/2){
    let c = Math.sqrt(W**2+H**2);
    console.log(c)
    let pos = 4*c/total*player;
    let side = Math.floor(pos/c);
    let x = 0;
    let y = 1;
    if (side != 4){
        let d = pos%(4*c);
        if (side == 0 || side == 2) d = c-d;
        console.log(d)
        x = -(c*W/d-W);
        y = -(c*H/d-H);
        if (y==0) y = 1;
    }
    //console.log(x," - ",y, " - ",side)
    return Math.atan(y/x)+side*Math.PI/2;
}*/