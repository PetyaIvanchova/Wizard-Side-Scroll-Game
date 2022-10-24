const gameStart = document.querySelector('.game-start');
const gameArea = document.querySelector('.game-area');
const gameOver = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');
const gamePoints = document.querySelector('.points');

gameStart.addEventListener('click', onGameStart);

function onGameStart() {
  gameStart.classList.add('hide');

  const wizard = document.createElement('div');
  wizard.classList.add('wizard');
  wizard.style.top = player.y + 'px';
  wizard.style.left = player.x + 'px';
  gameArea.appendChild(wizard);

  player.width = wizard.offsetWidth;
  player.height = wizard.offsetHeight;

  window.requestAnimationFrame(gameAction);
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let scene = {
  score: 0,
  lastCloudSpawn: 0,
  lastBugSpawn: 0,
  isActiveGame: true,
};

let keys = {};

let player = {
  x: 150,
  y: 100,
  width: 0,
  height: 0,
  lastTimeFiredBall: 0,
};

let game = {
  speed: 2,
  movingMultiplier: 4,
  fireBallMultiplier: 5,
  fireInterval: 1000,
  cloudSpawnInterval: 3000,
  bugSpawnInterval: 3000,
  bugKillBonus: 2000,
};

function onKeyDown(e) {
  keys[e.code] = true;
  console.log(keys);
}

function onKeyUp(e) {
  keys[e.code] = false;
  console.log(keys);
}

function gameAction(timestamp) {
  const wizard = document.querySelector('.wizard');

  scene.score++;

  if (
    timestamp - scene.lastBugSpawn >
    game.bugSpawnInterval + 5000 * Math.random()
  ) {
    let bug = document.createElement('div');
    bug.classList.add('bug');
    bug.x = gameArea.offsetWidth - 60;
    bug.style.left = bug.x + 'px';
    bug.style.top = (gameArea.offsetHeight - 60) * Math.random() + 'px';
    gameArea.appendChild(bug);
    scene.lastBugSpawn = timestamp;
  }

  let bugs = document.querySelectorAll('.bug');
  bugs.forEach((bug) => {
    bug.x -= game.speed * 3;
    bug.style.left = bug.x + 'px';
    if (bug.x + bugs.offsetWidth <= 0) {
      bug.parentElement.removeChild(bug);
    }
  });

  if (
    timestamp - scene.lastCloudSpawn >
    game.cloudSpawnInterval + 20000 * Math.random()
  ) {
    let cloud = document.createElement('div');
    cloud.classList.add('cloud');
    cloud.x = gameArea.offsetWidth;
    cloud.style.left = cloud.x + 'px';
    cloud.style.top = (gameArea.offsetHeight - 200) * Math.random() + 'px';
    gameArea.appendChild(cloud);
    scene.lastCloudSpawn = timestamp;
  }

  let clouds = document.querySelectorAll('.cloud');
  clouds.forEach((cloud) => {
    cloud.x -= game.speed;
    cloud.style.left = cloud.x + 'px';

    if (cloud.x + clouds.offsetWidth <= 0) {
      cloud.parentElement.removeChild(cloud);
    }
  });

  let fireBalls = document.querySelectorAll('.fire-ball');
  fireBalls.forEach((fireBall) => {
    fireBall.x += game.speed * game.fireBallMultiplier;
    fireBall.style.left = fireBall.x + 'px';

    if (fireBall.x + fireBall.offsetWidth > gameArea.offsetWidth) {
      fireBall.parentElement.removeChild(fireBall);
    }
  });

  let isInAir = player.y + player.height <= gameArea.offsetHeight;
  if (isInAir) {
    player.y += game.speed;
  }

  if (keys.Space && timestamp - player.lastTimeFiredBall > game.fireInterval) {
    wizard.classList.add('wizard-fire');
    addFireBall(player);
    player.lastTimeFiredBall = timestamp;

    isCollision(wizard, wizard);
  } else {
    wizard.classList.remove('wizard-fire');
  }

  if (keys.ArrowUp && player.y > 0) {
    player.y -= game.speed * game.movingMultiplier;
  }

  if (keys.ArrowDown && player.y + player.height < gameArea.offsetHeight) {
    player.y += game.speed * game.movingMultiplier;
  }

  if (keys.ArrowLeft && player.x > 0) {
    player.x -= game.speed * game.movingMultiplier;
  }

  if (keys.ArrowRight && player.x + player.width < gameArea.offsetWidth) {
    player.x += game.speed * game.movingMultiplier;
  }

  bugs.forEach((bug) => {
    if (isCollision(wizard, bug)) {
      scene.isActiveGame = false;
    }

    fireBalls.forEach((fireBall) => {
      if (isCollision(fireBall, bug)) {
        scene.score += game.bugKillBonus;
        bug.parentElement.removeChild(bug);
        fireBall.parentElement.removeChild(fireBall);
      }
    });
  });

  wizard.style.top = player.y + 'px';
  wizard.style.left = player.x + 'px';

  gamePoints.textContent = scene.score;

  if (!scene.isActiveGame) {
    gameOverAction();
  } else {
    window.requestAnimationFrame(gameAction);
  }
}

function addFireBall() {
  let fireBall = document.createElement('div');

  fireBall.classList.add('fire-ball');
  fireBall.style.top = player.y + player.height / 3 - 5 + 'px';
  fireBall.x = player.x + player.width;
  fireBall.style.left = fireBall.x + 'px';

  gameArea.appendChild(fireBall);
}

function isCollision(firstElement, secondElement) {
  let firstRect = firstElement.getBoundingClientRect();
  let secondRect = secondElement.getBoundingClientRect();

  return !(
    firstRect.top > secondRect.bottom ||
    firstRect.bottom < secondRect.top ||
    firstRect.right < secondRect.left ||
    firstRect.left > secondRect.right
  );
}

function gameOverAction(){
    scene.isActiveGame = false;
    gameOver.classList.remove('hide');
}

