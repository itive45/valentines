// ====== CONFIG ======
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const winMessage = document.getElementById('winMessage');
const loveVideo = document.getElementById('loveVideo');

const heartImg = 'assets/heart-cursor.png';
const roseImg = 'assets/rose.png';
const catchSoundSrc = 'assets/catch-sound.mp3';

let score = 0;
const winningScore = 10; // adjust as you like
const maxObjects = 15;   // max hearts/roses at a time
const spawnInterval = 1200; // milliseconds

let activeObjects = 0;

// ====== SPAWN OBJECT ======
function spawnObject(type) {
  if (activeObjects >= maxObjects) return;

  const obj = document.createElement('img');
  obj.src = type === 'heart' ? heartImg : roseImg;
  obj.className = 'falling-object';
  
  const size = Math.floor(Math.random() * 30) + 30; // 30-60px
  obj.style.width = `${size}px`;
  
  const startX = Math.random() * (gameArea.offsetWidth - size);
  obj.style.left = `${startX}px`;
  obj.style.top = `-50px`;

  gameArea.appendChild(obj);
  activeObjects++;

  // Animate falling
  let position = -50;
  const speed = Math.random() * 2 + 1; // 1-3 px per frame
  function fall() {
    position += speed;
    obj.style.top = position + 'px';

    if (position < gameArea.offsetHeight) {
      requestAnimationFrame(fall);
    } else {
      // remove if reaches bottom
      gameArea.removeChild(obj);
      activeObjects--;
    }
  }
  requestAnimationFrame(fall);

  // Catch on click
  obj.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    // Play catch sound
    const audio = new Audio(catchSoundSrc);
    audio.play();

    // Remove object
    if (gameArea.contains(obj)) {
      gameArea.removeChild(obj);
      activeObjects--;
    }

    // Check win
    if (score >= winningScore) winGame();
  });
}

// ====== WIN GAME ======
function winGame() {
  winMessage.classList.remove('hidden');
  createFirework(gameArea.offsetWidth / 2, gameArea.offsetHeight / 2);

  // preload and play video
  if (loveVideo) {
    loveVideo.load();
    loveVideo.play().catch(() => console.log('Video autoplay blocked, click to play'));
  }
}

// ====== FIREWORKS ======
function createFirework(x, y) {
  const firework = document.createElement('div');
  firework.className = 'firework';
  firework.style.left = `${x}px`;
  firework.style.top = `${y}px`;
  gameArea.appendChild(firework);

  setTimeout(() => {
    if (gameArea.contains(firework)) gameArea.removeChild(firework);
  }, 1000);
}

// ====== SPAWN LOOP ======
setInterval(() => {
  const type = Math.random() < 0.5 ? 'heart' : 'rose';
  spawnObject(type);
}, spawnInterval);
