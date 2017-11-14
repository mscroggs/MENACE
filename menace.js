/***********************************/
/*            MENACE               */
/*                                 */
/*        Machine Educable         */
/*      Noughts And Crosses        */
/*             Engine              */
/***********************************/
/* Based on the first MENACE built */
/* by Donal Michie in 1960 using   */
/* matchboxes.                     */
/***********************************/
/*     This implementation was     */
/*           written by            */
/*         Matthew Scroggs         */
/*    http://www.mscroggs.co.uk    */
/***********************************/

orderedBoxes = Array()
s=Array(8,4,2,1)
incentives=Array(3,1,1)
player='h'
human_turn=false

whoA = {"h":"Human","r":"Random","m":"MENACE2"}


function setPlayer(setTo){
    player=setTo
    moves2 = Array()
    document.getElementById("who").innerHTML = whoA[setTo]
    if(setTo=="r" && human_turn){
        play_random()
    }
    if(setTo=="m" && human_turn){
        play_menace2()
    }
}

boxes = Array()
boxes2 = Array()

pwns = Array(
    Array(0,1,2),
    Array(3,4,5),
    Array(6,7,8),
    Array(0,3,6),
    Array(1,4,7),
    Array(2,5,8),
    Array(0,4,8),
    Array(6,4,2)
)

rotations=Array(
    Array(0,1,2,3,4,5,6,7,8),
    Array(0,3,6,1,4,7,2,5,8),
    Array(6,3,0,7,4,1,8,5,2),
    Array(6,7,8,3,4,5,0,1,2),
    Array(8,7,6,5,4,3,2,1,0),
    Array(8,5,2,7,4,1,6,3,0),
    Array(2,5,8,1,4,7,0,3,6),
    Array(2,1,0,5,4,3,8,7,6)
)

said=Array("","","","","","","","","","")

function apply_rotation(pos,rot){
    new_pos=""
    for(var j=0;j<9;j++){
        new_pos+=pos[rot[j]]
    }
    return(new_pos)
}

function add_box(pos,dummy_moves){
    rots=find_rotations(pos)
    if(three(pos)=="0" && rots[0]==0){
        for(var i=1;i<rots.length;i++){
            r=rotations[rots[i]]
            for(var j=0;j<9;j++){
                if(r[j]!=j){
                    dummy_moves[Math.min(j,r[j])]=0
                }
            }
        }
        orderedBoxes[orderedBoxes.length] = pos
        boxes[pos]=dummy_moves
    }
}

function add_box2(pos,dummy_moves){
    rots=find_rotations(pos)
    if(three(pos)=="0" && rots[0]==0){
        for(var i=1;i<rots.length;i++){
            r=rotations[rots[i]]
            for(var j=0;j<9;j++){
                if(r[j]!=j){
                    dummy_moves[Math.min(j,r[j])]=0
                }
            }
        }
        boxes2[pos]=dummy_moves
    }
}

function find_rotation(pos){
    max_rot=find_rotations(pos)
    return(max_rot[Math.floor(Math.random()*max_rot.length)])
}
function find_rotations(pos){
    max=-1
    max_rot=Array()
    for(var i=0;i<rotations.length;i++){
        try_pos=apply_rotation(pos,rotations[i])
        if(try_pos>max){
            max=try_pos
            max_rot=Array()
        }
        if(try_pos==max){
            max_rot.push(i)
        }
    }
    return(max_rot)
}

function say(stuff){
    new_said=Array(stuff)
    for(var i=0;i<9;i++){
        new_said.push(said[i])
    }
    said=new_said
    document.getElementById("list_here").innerHTML=said.join("<br />")
}


function add_win(n){
    wins_each[n-1]+=1
    document.getElementById("dis"+n).innerHTML=wins_each[n-1]
}
function three(pos){
    for(var i=0;i<pwns.length;i++){
        if(pos[pwns[i][0]]!="0" && pos[pwns[i][0]]==pos[pwns[i][1]] && pos[pwns[i][1]]==pos[pwns[i][2]]){
            return(parseInt(pos[pwns[i][0]]))
        }
    }
    return(0)
}

function winner(){
    pos=board.join("")
    th=three(pos)
    if(th!=0){return(th)}
    if(num_empty()==0){return(3)} //draw
    return(0)
}

function check_win(){
    who_wins=winner()
    if(who_wins!=0){
        if(who_wins==1){say("MENACE wins.")}
        if(who_wins==2){
            if(player=='h'){say("You win.")}
            if(player=='m'){say("MENACE2 wins.")}
            if(player=='r'){say("Random wins.")}
        }
        if(who_wins==3){say("It's a draw.")}
        do_win(who_wins)
        human_turn=false
    }
}

function do_win(who_wins){
    no_winner=false
    for(var i=0;i<9;i++){
        if(board[i]==0){
            document.getElementById("pos"+i).innerHTML=""
        }
    }
    if(who_wins==1){menace_win()}
    if(who_wins==2){menace_lose()}
    if(who_wins==3){menace_draw()}
    window.setTimeout(new_game,1000)
}


function reset_menace(){
    wins_each=Array(0,0,0)
    orderedBoxes = Array()

    // First moves
    add_box("000000000",Array(s[0],s[0],s[0],s[0],s[0],s[0],s[0],s[0],s[0]))

    // Third moves
    for(var i=0;i<9;i++){for(var j=0;j<9;j++){if(i!=j){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[1])
                }
            }
            add_box(pos,dummy_moves)
    } }}

    // Fifth moves
    for(var i=0;i<9;i++){for(var k=0;k<i;k++){
    for(var j=0;j<9;j++){if(i!=j && k!=j){for(var l=0;l<j;l++){if(i!=l && k!=l){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i || a==k){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j || a==l){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[2])
                }
            }
            add_box(pos,dummy_moves)
    }} }}}}
    
    // Seventh moves
    for(var i=0;i<9;i++){for(var k=0;k<i;k++){for(var m=0;m<k;m++){
    for(var j=0;j<9;j++){if(i!=j && k!=j && m!=j){for(var l=0;l<j;l++){if(i!=l && k!=l && m!=l){for(var n=0;n<l;n++){if(i!=n && k!=n && m!=n){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i || a==k || a==m){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j || a==l || a==n){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[3])
                }
            }
            add_box(pos,dummy_moves)
    }}} }}}}}}
    show_menace()
    new_game()
}

function reset_menace2(){
    // Second moves
    for(var i=0;i<9;i++){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i){
                    pos+="1"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[0])
                }
            }
            add_box2(pos,dummy_moves)
    }

    // Fourth moves
    for(var i=0;i<9;i++){for(var k=0;k<i;k++){
    for(var j=0;j<9;j++){if(i!=j && k!=l){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i || a==k){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[1])
                }
            }
            add_box2(pos,dummy_moves)
    }} }}

    // Sixth moves
    for(var i=0;i<9;i++){for(var k=0;k<i;k++){for(var m=0;m<k;m++){
    for(var j=0;j<9;j++){if(i!=j && k!=j){for(var l=0;l<j;l++){if(i!=l && k!=l){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i || a==k || a==m){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j || a==l){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[2])
                }
            }
            add_box2(pos,dummy_moves)
    }}} }}}}
    
    // Eighth moves
    for(var i=0;i<9;i++){for(var k=0;k<i;k++){for(var m=0;m<k;m++){for(var o=0;o<m;o++){
    for(var j=0;j<9;j++){if(i!=j && k!=j && m!=j){for(var l=0;l<j;l++){if(i!=l && k!=l && m!=l){for(var n=0;n<l;n++){if(i!=n && k!=n && m!=n){
            pos=""
            dummy_moves=Array()
            for(var a=0;a<9;a++){
                if(a==i || a==k || a==m || a==o){
                    pos+="1"
                    dummy_moves.push(0)
                } else if(a==j || a==l || a==n){
                    pos+="2"
                    dummy_moves.push(0)
                } else {
                    pos+="0"
                    dummy_moves.push(s[3])
                }
            }
            add_box2(pos,dummy_moves)
    }}}} }}}}}}
}

function make_ox(pos){
    output = "<center><table class='board'>"
    str = pos.replace(/0/g," ")
    str = str.replace(/1/g,"O")
    str = str.replace(/2/g,"X")
    for(var i=0;i<9;i++){
        if(i%3==0){output+="<tr>"}
        output += "<td id='"+pos+"-"+i+"' class='p"+i
        if(str[i]==" "){
            output += " num'>"+boxes[pos][i]+"</td>"
        } else {
            output += "'>"
            if(str[i]=="O"){output+="&#9711;"}
            if(str[i]=="X"){output+="&times;"}
            output += "</td>"
        }
        if(i%3==2){output+="</tr>"}
    }
    output+="</table></center>"
    return output
}

function show_set(){
    document.getElementById("im1").value=parseInt(s[0])
    document.getElementById("im3").value=parseInt(s[1])
    document.getElementById("im5").value=parseInt(s[2])
    document.getElementById("im7").value=parseInt(s[3])
    document.getElementById("ic_w").value=parseInt(incentives[0])
    document.getElementById("ic_d").value=parseInt(incentives[1])
    document.getElementById("ic_l").value=parseInt(incentives[2])
    document.getElementById("tweak_h").style.display="block"
    document.getElementById("tweak_s").style.display="none"
}
function hide_set(){
    document.getElementById("tweak_h").style.display="none"
    document.getElementById("tweak_s").style.display="block"
}
function update_set_r(){
    update_set()
    reset_menace()
    reset_menace2()
}
function update_set(){
    s[0]=document.getElementById("im1").value
    s[1]=document.getElementById("im3").value
    s[2]=document.getElementById("im5").value
    s[3]=document.getElementById("im7").value
    incentives[0]=document.getElementById("ic_w").value
    incentives[1]=document.getElementById("ic_d").value
    incentives[2]=document.getElementById("ic_l").value
    hide_set()
}

function show_menace(){
    output=""
    output+="<span id='tweak_s'><a href='javascript:show_set()'>Adjust MENACE's settings</a></span>"
    output+="<span id='tweak_h' style='display:none'><a href='javascript:hide_set()'>Hide settings</a><br />"
    output+="Inital marbles<br /><small>"
    output+="First Moves: <input size=1 id='im1' /> "
    output+="Third Moves: <input size=1 id='im3' /><br />"
    output+="Fifth Moves: <input size=1 id='im5' /> "
    output+="Seventh Moves: <input size=1 id='im7'></small><br />"
    output+="Incentives<br /><small>"
    output+="Win: Add <input size=1 id='ic_w' /> marbles<br/>"
    output+="Draw: Add <input size=1 id='ic_d' /> marbles<br/>"
    output+="Lose: Take <input size=1 id='ic_l' /> marbles<br/>"
    output+="<form onsubmit='update_set();return false'>"
    output+="<input type='submit' value='Update MENACE'>"
    output+="</form>"
    output+="<form onsubmit='update_set_r();return false'>"
    output+="<input type='submit' value='Update and reset MENACE'>"
    output+="</form>"
    output+="</span>"

    output+="</form>"
    output+="</span>"
    output+="<table>"
    cols=0
    numb=0
    for(var k=0;k<orderedBoxes.length;k++){
        key = orderedBoxes[k]
        if(cols==0){output+=("<tr>")}
        cols+=1
        numb+=1
        output+=("<td class='board' id='board"+key+"'>"+make_ox(key)+"</td>")
        if(cols==8){output+=("</tr>");cols=0}
    }
    if(cols!=0){output+=("</tr>")}
    output+=("</table><br /><br />")
    output="These are the "+numb+" matchboxes which power MENACE.<br />"+output
    document.getElementById("moves").innerHTML=output
}

function update_box(key){
    document.getElementById("board"+key).innerHTML=make_ox(key)
}


function box_add(pos,move,change){
    boxes[pos][move]=Math.max(0,parseInt(change)+parseInt(boxes[pos][move]))
    update_box(pos)
}

function box_add2(pos,move,change){
    boxes2[pos][move]=Math.max(0,parseInt(change)+parseInt(boxes2[pos][move]))
}

function menace_win(){
    for(var i=0;i<moves.length;i++){
        box_add(moves[i][0],moves[i][1],incentives[0])
    }
    if(player=="m"){
    for(var i=0;i<moves2.length;i++){
        box_add2(moves2[i][0],moves2[i][1],-incentives[2])
    }
    }

    add_win(1)
}
function menace_draw(){
    for(var i=0;i<moves.length-1;i++){
        box_add(moves[i][0],moves[i][1],incentives[1])
    }
    if(player=="m"){
    for(var i=0;i<moves2.length;i++){
        box_add2(moves2[i][0],moves2[i][1],incentives[1])
    }
    }
    add_win(2)
}
function menace_lose(){
    for(var i=0;i<moves.length;i++){
        box_add(moves[i][0],moves[i][1],-incentives[2])
    }
    if(player=="m"){
    for(var i=0;i<moves2.length;i++){
        box_add2(moves2[i][0],moves2[i][1],incentives[0])
    }
    }
    add_win(3)
}

function new_game(){
    moves=Array()
    moves2=Array()
    board=Array(0,0,0,0,0,0,0,0,0)
    no_winner=true
    for(var i=0;i<9;i++){
        document.getElementById("pos"+i).innerHTML="<form onsubmit='javascript:play_human("+i+");return false'><input type='submit' value=' '></form>"
    }
    play_menace()
}

function play_menace(){
    if(num_empty()==1){
        for(var i=0;i<9;i++){if(board[i]==0){inv_where=i}}
    } else {
        pos=board.join("")
        which_rot=find_rotation(pos)
        pos=apply_rotation(pos,rotations[which_rot])
        plays=boxes[pos]
        where=make_move(plays)
        document.getElementById(pos+"-"+where).style.color="#FF0000"
        inv_where=rotations[which_rot][where]
        moves.push(Array(pos,where))
    }
    board[inv_where]=1
    alert("-->"+inv_where)
    document.getElementById("pos"+inv_where).innerHTML="&#9711;"
    check_win()
    if(no_winner){
        if(player=='r'){
            play_random()
        } else if(player=='m'){
            play_menace2()
        } else if(player=='h'){
            human_turn=true
        }
    }
}

function play_menace2(){
    pos=board.join("")
    which_rot=find_rotation(pos)
    pos=apply_rotation(pos,rotations[which_rot])
    plays=boxes2[pos]
    where=make_move2(plays)
    inv_where=rotations[which_rot][where]
    moves2.push(Array(pos,where))
    board[inv_where]=2
    document.getElementById("pos"+inv_where).innerHTML="&times;"
    check_win()
    if(no_winner){
        window.setTimeout(play_menace,100)
    }
}

function play_human(where){
if(no_winner){
    human_turn=false
    board[where]=2
    document.getElementById("pos"+where).innerHTML="&times;"
    check_win()
    if(no_winner){
        play_menace()
    }
}}

function play_random(){
if(no_winner){
    choices = Array()
    for(var i=0;i<9;i++){
        if(board[i]==0){choices[choices.length]=i;}
    }
    human_turn=false
    where = choices[Math.floor(Math.random()*choices.length)]
    board[where]=2
    document.getElementById("pos"+where).innerHTML="&times;"
    check_win()
    if(no_winner){
        window.setTimeout(play_menace,100)
    }
}}

function num_empty(){
    empty=0
    for(var i=0;i<9;i++){
        if(board[i]==0){empty+=1}
    }
    return(empty)
}

function make_move(plays){
    total=0
    for(var i=0;i<plays.length;i++){
        total+=plays[i]/1
    }
    alert(plays)
    alert(total)
    if(total==0){
        say("MENACE resigns.")
        do_win(2)
    } else {
        rnd = Math.floor(Math.random()*total)
        total = 0
        for(var i=0;i<plays.length;i++){
            total+=plays[i]/1
            if(rnd<total){return(i)}
        }
    }
}

function make_move2(plays){
    total=0
    for(var i=0;i<plays.length;i++){
        total+=plays[i]/1
    }
    if(total==0){
        say("MENACE2 resigns.")
        do_win(1)
    } else {
        rnd = Math.floor(Math.random()*total)
        total = 0
        for(var i=0;i<plays.length;i++){
            total+=plays[i]/1
            if(rnd<total){return(i)}
        }
    }
}

reset_menace()
reset_menace2()
