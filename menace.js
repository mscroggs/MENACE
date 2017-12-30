/***********************************/
/*            MENACE               */
/*                                 */
/*        Machine Educable         */
/*      Noughts And Crosses        */
/*             Engine              */
/***********************************/
/* Based on the first MENACE built */
/* by Donald Michie in 1960 using  */
/* matchboxes.                     */
/***********************************/
/*     This implementation was     */
/*           written by            */
/*         Matthew Scroggs         */
/*    http://www.mscroggs.co.uk    */
/***********************************/

// MENACEs
var menace = {
 1:{
    "boxes":{},
    "orderedBoxes":[],
    "start":[8,4,2,1],
    "removesymm":true,
    "incentives":[1,3,-1],
    "moves":[],
    "player":1},
 2:{
    "boxes":{},
    "orderedBoxes":[],
    "start":[8,4,2,1],
    "removesymm":true,
    "incentives":[1,3,-1],
    "moves":[],
    "player":2}
}

// what is player 2?
var player = 'h'
var whoA = {"h":"Human", "r":"Random", "m":"MENACE2", "p":"Perfect"}

// plotting
var plotdata = [0]
var xmin = 0
var xmax = 0
var ymin = 0
var ymax = 0

// game data
var wins_each = [0,0,0]
var board = [0,0,0,0,0,0,0,0,0]
var no_winner = true
var pieces = ["","&#9711;","&times;"]
var said = ["","","","","","","","","",""]
var human_turn=false
var pwns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

var rotations=[
    [0,1,2,3,4,5,6,7,8],
    [0,3,6,1,4,7,2,5,8],
    [6,3,0,7,4,1,8,5,2],
    [6,7,8,3,4,5,0,1,2],
    [8,7,6,5,4,3,2,1,0],
    [8,5,2,7,4,1,6,3,0],
    [2,5,8,1,4,7,0,3,6],
    [2,1,0,5,4,3,8,7,6]
]

// array utility functions
function arrmin(arr){
    var out = arr[0]
    for(var i=1;i<arr.length;i++){
        out = Math.min(out,arr[i])
    }
    return out
}

function arrmax(arr){
    var out = arr[0]
    for(var i=1;i<arr.length;i++){
        out = Math.max(out,arr[i])
    }
    return out
}

function array_fill(start,length,value){
    var out = []
    for(var i=start;i<length;i++){
        out[i]=value
    }
    return out
}

function count(arr, value){
    var out = 0
    for(var i=0;i<arr.length;i++){
        if(arr[i] == value){out++}
    }
    return out
}

// game functions
function new_game(){
    menace[1]["moves"] = []
    menace[2]["moves"] = []
    board = [0,0,0,0,0,0,0,0,0]
    no_winner = true
    for(var i=0;i<9;i++){
        document.getElementById("pos"+i).innerHTML = "<form onsubmit='javascript:play_human("+i+");return false'><input type='submit' value=' '></form>"
    }
    play_menace()
}

function setPlayer(setTo){
    player = setTo
    document.getElementById("who").innerHTML = whoA[setTo]
    if(setTo=="m"){
        show_menace(2)
    } else {
        hide_menace(2)
    }
    if(setTo!="h" && human_turn){
        play_opponent()
    }
}

function winner(b){
    var pos = b.join("")
    var th = three(pos)
    if(th != 0){
        return th
    }
    if(count(b,0) == 0){
        return 0
    }
    return false
}

function opposite_result(r){
    if(r==0){
        return 0
    }
    return 3-r
}

function check_win(){
    var who_wins = winner(board)
    if(who_wins !== false){
        if(who_wins == 0){
            say("It's a draw.")
        }
        if(who_wins == 1){
            say("MENACE wins.")
        }
        if(who_wins == 2){
            say(whoA[player]+" wins.")
        }
        do_win(who_wins)
        human_turn = false
    }
}

function do_win(who_wins){
    no_winner = false
    for(var i=0;i<9;i++){
        if(board[i] == 0){
            document.getElementById("pos"+i).innerHTML = ""
        }
    }
    menace_add_beads(who_wins)
    window.setTimeout(new_game,1000)
}

function play_menace(){
    where = get_menace_move(1)
    if(where=="resign"){
        do_win(2)
        say("MENACE resigns")
        return
    }
    board[where] = 1
    document.getElementById("pos"+where).innerHTML = pieces[1]
    check_win()
    if(no_winner){
        play_opponent()
    }
}

function play_opponent(){
    if(player == 'h'){
        human_turn = true
        return
    }
    human_turn = false
    var where = undefined
    if(player == 'r'){
        where = get_random_move()
    } else if(player == 'm'){
        where = get_menace_move(2)
    } else if(player == 'p'){
        where = get_perfect_move()
    }
    if(where=="resign"){
        do_win(1)
        say("MENACE2 resigns")
        return
    }
    board[where] = 2
    document.getElementById("pos"+where).innerHTML = pieces[2]
    check_win()
    if(no_winner){
        window.setTimeout(play_menace,100)
    }
}

// board functions
function apply_rotation(pos,rot){
    var new_pos = ""
    for(var j=0;j<9;j++){
        new_pos += pos[rot[j]]
    }
    return new_pos
}

function find_all_rotations(pos){
    var max = -1
    var max_rot = []
    for(var i=0;i<rotations.length;i++){
        var try_pos = apply_rotation(pos,rotations[i])
        if(try_pos > max){
            max = try_pos
            max_rot = []
        }
        if(try_pos == max){
            max_rot.push(i)
        }
    }
    return max_rot
}

function find_rotation(pos){
    var max_rot = find_all_rotations(pos)
    return max_rot[Math.floor(Math.random()*max_rot.length)]
}

function three(pos){
    for(var i=0;i<pwns.length;i++){
        if(pos[pwns[i][0]] != "0" && pos[pwns[i][0]] == pos[pwns[i][1]] && pos[pwns[i][1]] == pos[pwns[i][2]]){
            return parseInt(pos[pwns[i][0]])
        }
    }
    return 0
}

function rotation_is_max(pos){
    var rots = find_all_rotations(pos)
    return rots[0] == 0
}

// MENACE functions
function add_box(pos,n,s){
    menace[n]["orderedBoxes"][s].push(pos)
    menace[n]["boxes"][pos] = new_box(pos,n,menace[n]["start"][s])
}

function new_box(pos,n,start){
    var rots = find_all_rotations(pos)
    var box = array_fill(0,9,start)
    for(var i=0;i<9;i++){
        if(pos[i] != "0"){
            box[i] = 0
        }
    }
    if(menace[n]["removesymm"]){
        for(var i=1;i<rots.length;i++){
            var r = rotations[rots[i]]
            for(var j=0;j<9;j++){
                if(r[j]!=j){
                    box[Math.min(j,r[j])] = 0
                }
            }
        }
    }
    return box
}

function search_moves(b, n){
    var played = 10 - count(b,0)
    var move = 2 - played%2
    var other = 3 - move
    var minmove = 9
    for(var i=8;i>=0;i--){
        if(b[i] == move){
            minmove = i
        }
    }
    for(var i=0;i<minmove;i++){
        if(b[i]==0){
            var newboard = b.slice()
            newboard[i] = move
            if(n == other || n == "both"){
                if(winner(newboard) === false && rotation_is_max(newboard)){
                    add_box(newboard.join(""),other,Math.floor(played/2))
                }
            }
                if(played < 7){
                    search_moves(newboard,n)
                }
        }
    }
}

function order_boxes(n){
    menace[n]["orderedBoxes"] = menace[n]["orderedBoxes"][0].concat(menace[n]["orderedBoxes"][1],menace[n]["orderedBoxes"][2],menace[n]["orderedBoxes"][3])
}

function reset_menace(n){
    for(var i=1;i<=2;i++){
        if(n==i || n=="both"){
            menace[i]["orderedBoxes"] = [[],[],[],[]]
            menace[i]["boxes"] = []
        }
    }
    if(n == 1 || n == "both"){
        plotdata = [0]
        update_plot()
        wins_each = [0,0,0]
        for (var i=0;i<3;i++) {
            document.getElementById("dis"+i).innerHTML = wins_each[i]
        }

        add_box("000000000",1,0)
    }

    search_moves(array_fill(0,9,0),n)

    for(var i=1;i<=2;i++){
        if(n == i || n == "both"){
            order_boxes(i)
        }
    }
    show_menace(1)
    if(player=="m"){
        show_menace(2)
    }
    new_game()
}

function update_set_r(n){
    update_set(n)
    reset_menace(n)
}

function update_set(n){
    menace[n]["removesymm"] = (!document.getElementById("_"+n+"_includeall") || document.getElementById("_"+n+"_includeall").checked)
    if(n==1){
        menace[1]["start"][0] = parseInt(document.getElementById("im1").value)
        menace[1]["start"][1] = parseInt(document.getElementById("im3").value)
        menace[1]["start"][2] = parseInt(document.getElementById("im5").value)
        menace[1]["start"][3] = parseInt(document.getElementById("im7").value)
    }
    if(n==2){
        menace[2]["start"][0] = parseInt(document.getElementById("im2").value)
        menace[2]["start"][1] = parseInt(document.getElementById("im4").value)
        menace[2]["start"][2] = parseInt(document.getElementById("im5").value)
        menace[2]["start"][3] = parseInt(document.getElementById("im8").value)
    }
    menace[n]["incentives"][1] = parseInt(document.getElementById("_"+n+"_ic_w").value)
    menace[n]["incentives"][0] = parseInt(document.getElementById("_"+n+"_ic_d").value)
    menace[n]["incentives"][2] = -parseInt(document.getElementById("_"+n+"_ic_l").value)
    hide_set(n)
}

function box_add(pos,move,change,n){
    menace[n]["boxes"][pos][move] = Math.max(0,change+menace[n]["boxes"][pos][move])
    update_box(pos,n)
}

function menace_add_beads(result){
    for(var i=0;i<menace[1]["moves"].length;i++){
        box_add(menace[1]["moves"][i][0],menace[1]["moves"][i][1],menace[1]["incentives"][result],1)
    }
    if(player=="m"){
        for(var i=0;i<menace[2]["moves"].length;i++){
            box_add(menace[2]["moves"][i][0],menace[2]["moves"][i][1],menace[2]["incentives"][opposite_result(result)],2)
        }
    }
    update_totals(result)
}

function get_menace_move(n){
    var inv_where = 0
    if(count(board,0) == 1){
        for(var i=0;i<9;i++){
            if(board[i] == 0){
                inv_where = i
            }
        }
    } else {
        var pos = board.join("")
        var which_rot = find_rotation(pos)
        var pos = apply_rotation(pos,rotations[which_rot])
        var plays = menace[n]["boxes"][pos]
        var where = make_move(plays)
        if(where == "resign"){return "resign"}
        document.getElementById(pos+"-"+where).style.color = "#FF0000"
        var inv_where = rotations[which_rot][where]
        menace[n]["moves"].push([pos,where])
    }
    return inv_where
}

// UI functions
function update_totals(n){
    plotdata.push(plotdata[plotdata.length-1]+menace[1]["incentives"][n])
    wins_each[n] += 1
    document.getElementById("dis"+n).innerHTML = wins_each[n]
    update_plot()
}

function update_box(key,n){
    document.getElementById("board"+key).innerHTML = make_ox(key,n)
}

function say(stuff){
    var new_said = [stuff]
    for(var i=0;i<9;i++){
        new_said.push(said[i])
    }
    said = new_said
    document.getElementById("list_here").innerHTML = said.join("<br />")
}

function make_ox(pos,n){
    var output = "<center><table class='board'>"
    for(var i=0;i<9;i++){
        if(i%3 == 0){output+="<tr>"}
        output += "<td id='"+pos+"-"+i+"' class='p"+i
        if(pos[i] == 0){
            output += " num'>"+menace[n]["boxes"][pos][i]+"</td>"
        } else {
            output += "'>"
            output += pieces[pos[i]]
            output += "</td>"
        }
        if(i%3 == 2){output+="</tr>"}
    }
    output += "</table></center>"
    return output
}

function show_set(n){
    if(n==1){
        document.getElementById("im1").value = menace[1]["start"][0]
        document.getElementById("im3").value = menace[1]["start"][1]
        document.getElementById("im5").value = menace[1]["start"][2]
        document.getElementById("im7").value = menace[1]["start"][3]
    }
    if(n==2){
        document.getElementById("im2").value = menace[2]["start"][0]
        document.getElementById("im4").value = menace[2]["start"][1]
        document.getElementById("im6").value = menace[2]["start"][2]
        document.getElementById("im8").value = menace[2]["start"][3]
    }
    document.getElementById("_"+n+"_ic_w").value = menace[n]["incentives"][1]
    document.getElementById("_"+n+"_ic_d").value = menace[n]["incentives"][0]
    document.getElementById("_"+n+"_ic_l").value = -menace[n]["incentives"][2]
    document.getElementById("_"+n+"_includeall").checked = menace[n]["includeall"]
    document.getElementById("_"+n+"_tweak_h").style.display = "block"
    document.getElementById("_"+n+"_tweak_s").style.display = "none"
}

function hide_set(n){
    document.getElementById("_"+n+"_tweak_h").style.display = "none"
    document.getElementById("_"+n+"_tweak_s").style.display = "block"
}

function show_menace(n){
    var menacename = "MENACE"
    if(n==2){
        menacename += "2"
    }
    var output = ""
    output += "<span id='_"+n+"_tweak_s'><a href='javascript:show_set("+n+")'>Adjust "+menacename+"'s settings</a></span>"
    output += "<span id='_"+n+"_tweak_h' style='display:none'><a href='javascript:hide_set("+n+")'>Hide settings</a><br />"
    output += "Inital marbles<br /><small>"
    if(n==1){
        output += "First Moves: <input size=1 id='im1' /> "
        output += "Third Moves: <input size=1 id='im3' /><br />"
        output += "Fifth Moves: <input size=1 id='im5' /> "
        output += "Seventh Moves: <input size=1 id='im7'><br />"
    }
    if(n==2){
        output += "Second Moves: <input size=1 id='im2' /> "
        output += "Fourth Moves: <input size=1 id='im4' /><br />"
        output += "Sixth Moves: <input size=1 id='im6' /> "
        output += "Eighth Moves: <input size=1 id='im8'><br />"
    }
    output += "<input type='checkbox' id='_"+n+"_includeall'>Remove beads for symmetrically equivalent moves</small><br />"
    output += "Incentives<br /><small>"
    output += "Win: Add <input size=1 id='_"+n+"_ic_w' /> marbles<br/>"
    output += "Draw: Add <input size=1 id='_"+n+"_ic_d' /> marbles<br/>"
    output += "Lose: Take <input size=1 id='_"+n+"_ic_l' /> marbles<br/>"
    output += "<form onsubmit='update_set("+n+");return false'>"
    output += "<input type='submit' value='Update MENACE'>"
    output += "</form>"
    output += "<form onsubmit='update_set_r("+n+");return false'>"
    output += "<input type='submit' value='Update and reset MENACE'>"
    output += "</form>"
    output += "</span>"

    output += "</form>"
    output += "</span>"
    output += "<table>"
    var cols = 0
    var numb = 0
    for(var k=0;k<menace[n]["orderedBoxes"].length;k++){
        var key = menace[n]["orderedBoxes"][k]
        if(cols == 0){
            output += "<tr>"
        }
        cols += 1
        numb += 1
        output += "<td class='board' id='board"+key+"'>"+make_ox(key,n)+"</td>"
        if(cols == 8){
            output += "</tr>"
            cols = 0
        }
    }
    if(cols != 0){
        output += "</tr>"
    }
    output += "</table><br /><br />"
    output = "These are the " + numb + " matchboxes that power "+menacename+".<br />" + output
    document.getElementById("_"+n+"_moves").innerHTML = output
}

function hide_menace(n){
    document.getElementById("_"+n+"_moves").innerHTML = ""
}

// opponent moves
function get_random_move(){
    choices = []
    for(var i=0;i<9;i++){
        if(board[i] == 0){
            choices.push(i)
        }
    }
    return choices[Math.floor(Math.random()*choices.length)]
}

function get_perfect_move(){
    return minimax(board,2).index
}

function play_human(where){
    if(no_winner){
        human_turn = false
        board[where] = 2
        document.getElementById("pos"+where).innerHTML = pieces[2]
        check_win()
        if(no_winner){
            play_menace()
        }
    }
}

function make_move(plays){
    total = 0
    for(var i=0;i<plays.length;i++){
        total += plays[i]
    }
    if(total == 0){
        return "resign"
    } else {
        rnd = Math.floor(Math.random()*total)
        total = 0
        for(var i=0;i<plays.length;i++){
            total += plays[i]
            if(rnd < total){
                return i
            }
        }
    }
}

function minimax(newboard, player) {
    var who_wins = winner(newboard)
    if(who_wins!==false){
        if(who_wins == 1){
            return { score: -(10 + count(newboard,0)) }
        } else if(who_wins == 2){
            return { score: 10 + count(newboard,0) }
        } else if(who_wins == 0){
            return { score: 0 }
        }
    }
    var choices = []
    for(var i=0;i<9;i++){
        if(newboard[i] == 0){
            choices.push(i)
        }
    }
    var moves = []
    for(var i=0;i<choices.length;i++){
        var move = {}
        move.index = choices[i]
        newboard[choices[i]] = player
        result = minimax(newboard, 3-player)
        move.score = result.score
        newboard[choices[i]] = 0
        moves.push(move)
    }
    var bestMove = 0
    var bestScore = player == 1 ? 1000 : -1000
    for(var i=0;i<moves.length;i++) {
        if((player == 2 && moves[i].score > bestScore) || (player == 1 && moves[i].score < bestScore)) {
            bestScore = moves[i].score
            bestMove = i
        }
    }
    var bestMoves = []
    for(var i=0;i<moves.length;i++) {
        if(moves[i].score == bestScore) {
            bestMoves.push(i)
        }
    }
    return moves[bestMoves[Math.floor(Math.random() * bestMoves.length)]]
}


// plotting
function update_plot(){
    var oldlimits = [xmin,xmax,ymin,ymax]
    updateplotlimits()
    if(xmin == oldlimits[0] && xmax == oldlimits[1] && ymin == oldlimits[2] && ymax == oldlimits[3]){
        draw_point(plotdata.length-1)
    } else {
        redraw_plot()
    }
}

function redraw_plot(){
    var c=document.getElementById("plot_here")
    var ctx=c.getContext("2d")
    ctx.clearRect(0, 0, c.width, c.height)
    updateplotlimits()
    for(var i=0;i<=5;i++){
        var y = ymin + (ymax-ymin)*i/5
        ctx.textAlign = "right"
        ctx.fillText(y, xtopx(0)-2, 4+ytopx(y))
    }
    ctx.fillText(0, xtopx(0)-2, 4+ytopx(0))
    for(var i=1;i<=10;i++){
        var x = xmin + (xmax-xmin)*i/10
        ctx.textAlign = "center"
        ctx.fillText(x, xtopx(x), ytopx(0)+10)
    }
    ctx.beginPath()
    ctx.moveTo(xtopx(0),ytopx(ymax))
    ctx.lineTo(xtopx(0),ytopx(ymin))
    ctx.moveTo(xtopx(xmin),ytopx(0))
    ctx.lineTo(xtopx(xmax),ytopx(0))
    ctx.stroke()
    ctx.save()
    ctx.translate(220, 150)
    ctx.rotate(-Math.PI/2)
    ctx.textAlign = "center"
    ctx.fillText("Change in number of bead in first box", 0, -205)
    ctx.fillText("(3\xD7wins + losses - draws)", 0, -194)
    ctx.restore()
    ctx.textAlign = "right"
    ctx.fillText("Number of games", xtopx(xmax), ytopx(0)+20)
    for(var i=0;i<plotdata.length;i++){
        draw_point(i)
    }
}

function draw_point(i){
    var c=document.getElementById("plot_here")
    var ctx=c.getContext("2d")
    ctx.beginPath()
    ctx.arc(xtopx(i), ytopx(plotdata[i]), 3, 0, 2 * Math.PI, false)
    ctx.fillStyle = '#FF0000'
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    ctx.stroke()
    ctx.fillStyle = '#000000'
}

function ytopx(_y){
    return 5+290*(_y-ymax)/(ymin-ymax)
}

function xtopx(_x){
    return 40+390*(_x-xmin)/(xmax-xmin)
}

function updateplotlimits(){
    ymin = arrmin(plotdata)
    ymin -= 10 + ymin % 10
    ymin = Math.min(-10,ymin)
    ymax = arrmax(plotdata) + 10
    ymax -= ymax % 10
    xmin = 0
    xmax = plotdata.length + 20
    xmax -= xmax % 20
}

// start game
reset_menace("both")
