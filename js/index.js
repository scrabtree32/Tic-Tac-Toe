$(document).ready(function() {
  var origPlayer,
      aiPlayer,
      playerNum,
      whoseTurn,
      secPlayer,
      boxes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      boardArr = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      timeOut,
      randPlay = Math.floor(Math.random() * 10),
      randString = randPlay.toString(),
      winner;
  
//SETTINGS: which card to display 
function showCard(cardNum) {
  $('.card1, .card2, .card3, .card4, .reset').addClass('hidden');
  $('.card' + cardNum).removeClass('hidden');
  if(cardNum == '3' || cardNum == '4') $('.reset').removeClass('hidden');
}
showCard('1');

  //one or two players
$('.onePlayer, .twoPlayer').click(function() {
  if ($(this).text() == 'ONE PLAYER') playerNum = 1;
  else playerNum = 2;
  showCard('2');
});
  
  //is orig player X or O?
$('.X, .O').click(function() {
  if ($(this).text() == 'X') {
    origPlayer = 'X';
    secPlayer = aiPlayer = 'O';
  } else {
    origPlayer = 'O';
    secPlayer = aiPlayer = 'X';
  }
  showCard('3');
  whoFirst(playerNum);
  update();
});
  
//FIRST MOVE: randomly pick who plays first
function whoFirst(num) {
  if (num == 1) onePlayer();
  else twoPlayer();
}
function onePlayer() {
  if (Math.floor(Math.random() * 10) > 4) whoseTurn = origPlayer;
  else {
    whoseTurn = aiPlayer;
    $('.box').addClass('disable');
    update();
    setTimeout(function() {
      computerGo(randPlay - 1, randString);
      update();
    }, 1500);
  }
}
function twoPlayer() {
    if (Math.floor(Math.random() * 10) > 4) whoseTurn = origPlayer;
    else whoseTurn = secPlayer;
}
  
// computer's turn
function computerGo(ind, string) {
  addXOrO(aiPlayer, ind, string);
  whoseTurn = origPlayer;
  for(var i = 0; i < 9; i++) {
    if (boardArr[i] !== 'X' && boardArr[i] !== 'O') {
      var empty = i + 1;
    }
    $('.box' + empty).removeClass('disable');
  }
}
  
//GAME PLAY: add X or O to box and boardArr- disable clicking on said box
function addXOrO (player, ind, boxString) {
  if (boardArr[ind] != 'O' && boardArr[ind] != 'X') {
    boardArr[ind] = player;
    $('.box'+ boxString).html(player);
    $('.box' + boxString).addClass('disable');
  }
}
  
  //on box click, add X/O change whose turn and if playerNum = 1, computer goes
boxes.forEach(function(box) {
  $('.box' + box).click(function() {
    var boxNum = Number(box) - 1;
    var emptyArr = emptyInd(boardArr);
    addXOrO (whoseTurn, boxNum, box);
    if (playerNum == 1) { 
      var nextMove = minimax(boardArr, aiPlayer);
      whoseTurn = aiPlayer;
      $('.box').addClass('disable');
      update();
      setTimeout(function() {
        computerGo(Number(nextMove.index), nextMove.index + 1);
        update();
      }, 1500);
    } else {
      if (whoseTurn == secPlayer) whoseTurn = origPlayer;
      else whoseTurn = secPlayer;
      update();
    }
  });
});        

// back and reset
$('.back, .reset').click(function() {
  showCard('1');
  restart();
});
  
  //play again with same settings
$('.playAgain').click(function() {
  restart();
  showCard('3');
  whoFirst(playerNum);
  update();
});
  
//restart function
function restart() {
  boardArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  whoseTurn = origPlayer;
  $('.box').removeClass('disable');
  $('.box').html('');
  $('.update').html('');
}
  
//is it a winning board?
function winning(board, player) {
  if ( 
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)) {
    return true;
  } else { 
  return false;
  }
}

//empty indices
function emptyInd (board) {
  return board.filter(s => s != 'X' && s != 'O');
}
  
//who won?
function whoWon() {
    if (winning(boardArr, origPlayer) && playerNum == 2) winner = 'Player 1';
    else if (winning(boardArr, secPlayer) && playerNum == 2) winner = 'Player 2';
    else if (winning(boardArr, aiPlayer) && playerNum == 1) winner = 'Computer';
}
  
//whose turn is it?
function whoGoes() {
  if (whoseTurn == origPlayer && playerNum == 2)  return "Player 1's Turn!";
  else if (whoseTurn == secPlayer && playerNum == 2)  return "Player 2's Turn!";
  else if (whoseTurn == origPlayer && playerNum == 1)  return 'Your Turn!';
  else if (whoseTurn == aiPlayer && playerNum == 1)  return "Computer's Turn!";
}
  
//update html
function update() { 
    //if it is a winning board
  if (winning(boardArr, origPlayer) || winning(boardArr, secPlayer) || winning(boardArr, aiPlayer)) {
    whoWon();
    $('.box').addClass('disable');
    setTimeout(function(){
      $('.whoWon').html(winner + " Won!");
      $('.update').html('');
      showCard('4');
    }, 1500);
    //if it is tie
  } else if (emptyInd(boardArr).length < 1) {
    setTimeout(function(){
      $('.whoWon').html("It's a Tie!");
      $('.update').html('');
      $('.box').removeClass('disable');
      showCard('4');
    }, 1500);
    //game not over yet
  } else {
    $('.update').html(whoGoes());
  }
}

  
  //AI PLAYER: minimax function- return score based on winning, losing or tie
function minimax(newBoard, player){
  
  //available spots
  var availSpots = emptyInd(newBoard);
  // checks for the terminal states such as win, lose, and tie 
  //and returning a value accordingly
  if (winning(newBoard, origPlayer)){
     return {score:-10};
  }
	else if (winning(newBoard, aiPlayer)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }
  // an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++){
    //create an object for each and store the index of that spot 
    var move = {};
  	move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    
    if (player == aiPlayer){
      var result = minimax(newBoard, origPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    // reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }
  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

// else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

// return the chosen move (object) from the moves array
  return moves[bestMove];
}
});