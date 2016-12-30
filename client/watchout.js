// Game options
let gameOptions = {
  height: window.innerHeight - 20,
  width: window.innerWidth - 20,
  enemies: 40,
  enemyScrambleTime: 3000
};

let scoreBoard = {
  highScore: 0,
  current: 0,
  collisions: 0
};

// Player
let player = {
  color: 'red',
  x: gameOptions.width / 2,
  y: gameOptions.height / 2,
  radius: 10
};

// Enemies
class Enemy {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}

// Initialize enemies
let enemies = [];

for (var i = 0; i < gameOptions.enemies; i++) {
  enemies.push(new Enemy(Math.floor(Math.random() * gameOptions.width), Math.floor(Math.random() * gameOptions.height), 10));
}

// Player mousedrag
let drag = d3.behavior.drag().on('drag', function(d) {
  d3.select(this)
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
    // Implement boundaries TO DO
});

// Initialize gameboard
let gameBoard = d3.select('.board')
                  .append('svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

// Create variables for counters
let highscoreCounter = d3.select('.highscore').select('span');
let currentCounter = d3.select('.current').select('span');
let collisionCounter = d3.select('.collisions').select('span');

// Draw gameboard border
let gameBoardBorder = gameBoard.append('rect')
                                .attr('height', gameOptions.height)
                                .attr('width', gameOptions.width).
                                style('stroke', 'black')
                                .style('fill', 'none');

// Add player to board as a circle
gameBoard.data([{x: player.x, y: player.y}])
          .append('circle')
          .attr('class', 'player')
          .attr('cx', player.x)
          .attr('cy', player.y)
          .attr('r', player.radius)
          .attr('fill', player.color)
          .attr('stroke', 'black')
          .call(drag);

// Add enemies
gameBoard.selectAll('.enemy')
          .data(enemies)
          .enter()
          .append('circle')
          .attr('class', 'enemy')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('r', function(d) { return d.radius; })
          .attr('fill', 'green')
          .attr('stroke', 'black');

// Random position enemies
let randomPos = function() {
  d3.selectAll('.enemy').each(function(d) {
    d3.select(this)
      .transition()
      .duration(gameOptions.enemyScrambleTime)
      .attr('cx', Math.floor(Math.random() * gameOptions.width))
      .attr('cy', Math.floor(Math.random() * gameOptions.height));
  });
};

// Collision detection
let collision = function(enemies) {
  d3.selectAll('.enemy').each(function(d) {
    if ((Math.abs(d3.select(this).attr('cx') - d3.select('.player').attr('cx')) < 15) && (Math.abs(d3.select(this).attr('cy') - d3.select('.player').attr('cy')) < 15)) {
      console.log('Collision!');
      scoreBoard.collisions++;
      d3.select('.collisions').select('span').text(scoreBoard.collisions.toString());
      flashCollision();
      // Update highscore
      if (scoreBoard.current > scoreBoard.highScore) {
        scoreBoard.highScore = scoreBoard.current;
        highscoreCounter.text(scoreBoard.highScore.toString());
      }
      // Reset current score
      scoreBoard.current = 0;
      currentCounter.text(scoreBoard.current.toString());
    }
  });
};

let flashCollision = function() {
  let border = d3.select('rect');
  if (border.style('fill') === 'none') {
    border.style('fill', 'red');
    setTimeout(function() {
      border.style('fill', 'none');
    }, 400);
  }
};

let updateScoreBoard = function() {
  scoreBoard.current++;
  currentCounter.text(scoreBoard.current.toString());
};

randomPos();
setInterval(randomPos, gameOptions.enemyScrambleTime);
setInterval(updateScoreBoard, 100);
setInterval(collision, 50);