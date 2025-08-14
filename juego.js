const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box=20;
let snake=[{x:9*box,y:10*box}], dir=null;
let food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};
let score=0;

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp" && dir!=="DOWN") dir="UP";
    if(e.key==="ArrowDown" && dir!=="UP") dir="DOWN";
    if(e.key==="ArrowLeft" && dir!=="RIGHT") dir="LEFT";
    if(e.key==="ArrowRight" && dir!=="LEFT") dir="RIGHT";
});

function draw(){
    ctx.fillStyle="#001f54";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<snake.length;i++){
        ctx.fillStyle=(i===0)?"#4ecdc4":"#fff";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }
    ctx.fillStyle="red";
    ctx.fillRect(food.x,food.y,box,box);

    let head={x:snake[0].x, y:snake[0].y};
    if(dir==="UP") head.y-=box;
    if(dir==="DOWN") head.y+=box;
    if(dir==="LEFT") head.x-=box;
    if(dir==="RIGHT") head.x+=box;

    if(head.x<0 || head.x>=canvas.width || head.y<0 || head.y>=canvas.height || collide(head,snake)){
        alert("Game Over! Puntaje: "+score);
        enviarPuntaje(score);
        snake=[{x:9*box,y:10*box}]; dir=null; score=0;
        document.getElementById("puntaje").textContent=score;
        return;
    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){
        score++;
        food={x:Math.floor(Math.random()*20)*box, y:Math.floor(Math.random()*20)*box};
    } else snake.pop();

    document.getElementById("puntaje").textContent=score;
}

function collide(head,array){
    for(let i=0;i<array.length;i++) if(head.x===array[i].x && head.y===array[i].y) return true;
    return false;
}

setInterval(draw,150);

const db=firebase.firestore();

// Enviar puntaje
function enviarPuntaje(puntaje){
    const user=firebase.auth().currentUser;
    if(!user) return;
    db.collection("puntajes").add({
        usuario:user.email,
        puntaje:puntaje,
        fecha:firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Chat
const formChat=document.getElementById("formChat");
const mensajeInput=document.getElementById("mensajeInput");
const chatMensajes=document.getElementById("chatMensajes");

formChat.addEventListener("submit", e=>{
    e.preventDefault();
    const user=firebase.auth().currentUser;
    if(!user) return;
    db.collection("chat").add({
        usuario:user.email,
        mensaje:mensajeInput.value,
        fecha:firebase.firestore.FieldValue.serverTimestamp()
    });
    mensajeInput.value="";
});

// Mostrar chat en tiempo real
db.collection("chat").orderBy("fecha").onSnapshot(snapshot=>{
    chatMensajes.innerHTML="";
    snapshot.forEach(doc=>{
        const m=doc.data();
        chatMensajes.innerHTML+=`<p><b>${m.usuario}:</b> ${m.mensaje}</p>`;
        chatMensajes.scrollTop=chatMensajes.scrollHeight;
    });
});
