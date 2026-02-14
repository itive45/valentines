const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('winMessage');
const winningScore = 20; // adjustable for difficulty
let score = 0;

let mouseX = 0;
let mouseY = 0;

// Track mouse
gameArea.addEventListener('mousemove', e => {
  const rect = gameArea.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

// Sounds
const catchSound = new Audio("assets/catch-sound.mp3");

// Sweet messages
const messages = [
  "You're my heart! 💖",
  "I love you endlessly ❤️",
  "My Princess🌞",
  "Forever us 💌",
  "You're the loml 💕",
  "My one and only 💝"
];

// Spawn hearts
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = Math.random() * (gameArea.offsetWidth - 30) + 'px';
  heart.style.top = '-30px';
  gameArea.appendChild(heart);

  let speed = 2 + Math.random() * 3;

  function moveHeart() {
    let top = parseFloat(heart.style.top);
    top += speed;
    heart.style.top = top + 'px';

    const rect = heart.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    const relX = rect.left - gameRect.left;
    const relY = rect.top - gameRect.top;

    if(mouseX > relX && mouseX < relX + rect.width &&
       mouseY > relY && mouseY < relY + rect.height) {
      score++;
      scoreDisplay.textContent = 'Score: ' + score;
      heart.remove();
      catchSound.currentTime = 0;
      catchSound.play();
      showMessage();
      explodeHearts(relX, relY);

      if(score >= winningScore) winGame();
    } else if(top > gameArea.offsetHeight) {
      heart.remove();
    } else {
      requestAnimationFrame(moveHeart);
    }
  }

  moveHeart();
}

// Floating messages
function showMessage() {
  const msg = document.createElement('div');
  msg.textContent = messages[Math.floor(Math.random() * messages.length)];
  msg.classList.add('floatingMsg');
  msg.style.left = mouseX + 'px';
  msg.style.top = mouseY + 'px';
  gameArea.appendChild(msg);
  setTimeout(()=> msg.remove(), 1500);
}

// Exploding hearts
function explodeHearts(x, y){
  for(let i=0;i<5;i++){
    const sh = document.createElement('div');
    sh.classList.add('smallHeart');
    sh.style.left = x + 'px';
    sh.style.top = y + 'px';
    gameArea.appendChild(sh);

    const angle = Math.random()*2*Math.PI;
    const distance = 30 + Math.random()*30;
    const dx = Math.cos(angle)*distance;
    const dy = Math.sin(angle)*distance;

    sh.animate([{transform:'translate(0,0)', opacity:1},
                {transform:`translate(${dx}px,${dy}px)`, opacity:0}], 
                {duration:800, easing:'ease-out'});
    setTimeout(()=> sh.remove(), 800);
  }
}

// Fireworks
function createFirework(x, y){
  for(let i=0;i<40;i++){
    const fire = document.createElement('div');
    fire.classList.add('firework');
    fire.style.left = x+'px';
    fire.style.top = y+'px';
    gameArea.appendChild(fire);

    const angle = Math.random()*2*Math.PI;
    const distance = 50 + Math.random()*50;
    const dx = Math.cos(angle)*distance;
    const dy = Math.sin(angle)*distance;

    fire.animate([{transform:'translate(0,0)', opacity:1},
                  {transform:`translate(${dx}px,${dy}px)`, opacity:0}],
                  {duration:1500, easing:'ease-out'});
    setTimeout(()=> fire.remove(),1500);
  }
}

// Win game()
function winGame(){
  winMessage.classList.remove('hidden');
  createFirework(gameArea.offsetWidth/2, gameArea.offsetHeight/2);
  
  // Load video only when displayed
  const video = document.getElementById('loveVideo');
  if(video) video.load(); // triggers loading
}


// Spawn hearts and roses
function spawnObjects(){
  createHeart();
  if(Math.random() < 0.4){
    const rose = document.createElement('div');
    rose.classList.add('rose');
    rose.style.left = Math.random()*(gameArea.offsetWidth-40)+'px';
    rose.style.top = '-40px';
    gameArea.appendChild(rose);

    let speed = 1 + Math.random()*2;
    function moveRose(){
      let top = parseFloat(rose.style.top);
      top += speed;
      rose.style.top = top + 'px';
      if(top>gameArea.offsetHeight) rose.remove();
      else requestAnimationFrame(moveRose);
    }
    moveRose();
  }
}

setInterval(spawnObjects, 800);
