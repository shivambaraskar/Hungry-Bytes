let topBX = document.getElementById('topbox');
let canvas = document.getElementById('main-canvas');
let byte = document.getElementById('bytebox');
let food = document.getElementById('foodbox');
let score = document.getElementById('score');
let score_max = document.getElementById('highscore');

let old_x = 0;
let old_y = 0;
let food_posX = 120;
let food_posY = 180;
let max_x = (window.innerWidth-bytebox.offsetWidth)-(window.innerWidth-bytebox.offsetWidth)%30;
let max_y = (window.innerHeight-bytebox.offsetWidth-15)-(window.innerHeight-bytebox.offsetWidth-15)%30;
let pos = byte.style;
let food_pos = food.style;
let count = 0;
let highscore;
(localStorage.getItem('highscore')!=undefined) ? highscore = localStorage.getItem('highscore') : highscore = 0;
score_max.innerHTML = ` Highest Score: ${highscore} `;
let dead = false;
let tail = false;

let move_left = false;
let move_right = true;
let move_up = false;
let move_down = false;

let byte_positions=[];
let curr_block_positions=[];

topBX.style.width = `${max_x+10}px`;
canvas.style.width = `${max_x+10}px`;
canvas.style.height = `${max_y+10}px`;

let check_key = (event)=>{
    if (event.key == 'ArrowUp'){
        console.log("ArrowUp");
        move_left = false;
        move_right = false; 
        move_up = true;
        move_down = false;
    }
    else if (event.key == 'ArrowDown'){
        console.log("ArrowDown");
        move_left = false;
        move_right = false; 
        move_up = false;
        move_down = true;
    }
    else if (event.key == 'ArrowLeft'){
        console.log("ArrowLeft");
        move_left = true;
        move_right = false; 
        move_up = false;
        move_down = false;
    }
    else if (event.key == 'ArrowRight'){
        console.log("ArrowRight");
        move_left = false;
        move_right = true; 
        move_up = false;
        move_down = false;
    }
    if (event.key == 'Escape'){
        console.log("Escape");
        let des = confirm("Do Want To Quit??");
        (des)?dead=true:dead = false;
    }
    if (event.code == 'Space'){
        console.log("Space");
        alert("Game Paused");
    }
}

let foodbyte = () => {
    let x = Math.floor(Math.random()*max_x);
    let y = Math.floor(Math.random()*max_y);
    food_posX = x-x%30;
    food_posY = y-y%30;
    food_pos.left = `${food_posX}px`;
    food_pos.top = `${food_posY}px`;
    food_pos.display = "block";
}

let foodCaptured = () => {
    console.log(food_posX, food_posY, old_x, old_y);
    if(old_x === food_posX && old_y === food_posY){
        food_pos.display = "none";
        count++;
        (count > highscore) ? highscore = count : highscore = highscore;
        localStorage.setItem('highscore', highscore);
        score_max.innerHTML = ` Highest Score: ${highscore} `;
        score.innerHTML = ` Score: ${count} `;
        return true;
    }
    return false;
}

let byteGrow = () => {
    if (foodCaptured()){
        let newTail = document.createElement("div");
        newTail.setAttribute("class", "tail-box");
        newTail.setAttribute("id", `tail-${count}`);
        document.getElementById("main-canvas").appendChild(newTail);
        let tail_n = document.getElementById(`tail-${count}`);     
        tail_n.setAttribute("style", "top: 180px; left: 120px;");
        tail_n.innerHTML=`${count}`;
        tail=true;
    }
}

let moveTail = () => {
    let length = byte_positions.length-1;
    if(tail){
        if(length==0){
            let byte_tail = document.getElementById(`tail-${1}`);
            byte_tail.style.top = `${byte_positions[length].top}`;
            byte_tail.style.left = `${byte_positions[length].left}`;
        }
        else{
            for(let i=1; i<=count; i++){
                let byte_tail = document.getElementById(`tail-${i}`);
                byte_tail.style.top = `${byte_positions[length-i].top}`;
                byte_tail.style.left = `${byte_positions[length-i].left}`;
                curr_block_positions.push({top: `${byte_positions[length-i].top}`, left: `${byte_positions[length-i].left}`});
            }
        }
    }
}

let blockCollision = () => {
    if(tail){
        for(let i=1; i<curr_block_positions.length; i++){
            if (curr_block_positions[i].top==curr_block_positions[0].top && curr_block_positions[i].left==curr_block_positions[0].left){
                dead=true;
                alert("Blocks Collided!!");
                break;
            }
        }
        curr_block_positions=[];
    }
}

let movebyte = () => {
    if(tail==false){
        byte_positions=[];
    };
    let byte_head = document.getElementById('bytebox');
    if (!dead){
        if(move_right){
            ((max_x)-old_x > 30)?old_x = old_x + 30:dead = true;
            pos.left = `${old_x}px`;
        }

        else if(move_left){
            (old_x > 0)?old_x = old_x - 30:dead = true;
            pos.left = `${old_x}px`;
        }

        else if(move_up){
            (old_y > 0)?old_y = old_y - 30:dead = true;
            pos.top = `${old_y}px`;
        }

        else if(move_down){
            ((max_y)-old_y > 30)?old_y = old_y + 30:dead = true;
            pos.top = `${old_y}px`;
        }

        if(pos.top=='')
        pos.top = '0px';
        byte_positions.push({top: byte_head.style.top, left: byte_head.style.left});
        byteGrow();
        moveTail();
        blockCollision();
    }

    else{
        alert("You Are Dead. GAME OVER!");  
        clearInterval(gameInterval);
        clearInterval(foodInterval);
    }
}

document.addEventListener('keydown', check_key);
let gameInterval = setInterval(movebyte, 250);
let foodInterval = setInterval(foodbyte, 8000);