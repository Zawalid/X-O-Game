"use strict";
const c = console.log;
//! ----------- Selectors -----------
//Game mode
const gameMode = document.querySelector(".game_mode");
const chooseModeBtn = document.querySelector(".choose_mode");
const currentModeField = document.querySelector(".current_mode");
//Squares
const squares = document.querySelectorAll(".square");
//Start Game
const startGame = document.querySelector(".start ");
const startGameBtn = document.querySelector(".start button");
//Choose Marks
const choice = document.querySelector(".choice");
const confirmChoice = document.querySelector(".choice button");
//win Message
const winMsg = document.querySelector(".winMsgContainer");
const winner = document.querySelector(".winMsgContainer .winner");
const finalWinnerMsg = document.querySelector(".final_winner");
const finalWinnerPLayer = document.querySelector(".final_winner > p ");
//Retry
const retryBtn = document.querySelector(".retry");
const retryMsg = document.querySelector(".retryMsg");
const newGameBtn = document.querySelector(".newGame");
//PLayer and Scores and Rounds and Marks
const player_1 = document.querySelector(".player_1");
const player_2 = document.querySelector(".player_2");
const player1NameInput = document.getElementById("player1");
const player2NameInput = document.getElementById("player2");
const player1NameField = document.querySelector(".player1_name");
const player2NameField = document.querySelector(".player2_name");
const player1MarkField = document.querySelector(".player1_mark");
const player2MarkField = document.querySelector(".player2_mark");
const player1ScoreField = document.querySelector(".player1_score");
const player2ScoreField = document.querySelector(".player2_score");
const roundNumber = document.querySelector(".round_number");
const nextRound = document.querySelector(".next_round");

//! ----------- Variables -----------

//Number of full squares to check if the game ended or not
let number = 0;
//Current round
let currentRound = +roundNumber.textContent;
//Current mark
let currentMark = 0;
//ActivePlayer number (1/0)
let activePlayer = 0;
//Winner
let winnerPlayer;
//To follow the squares that have been already clicked
// let alreadyClicked = [];
// line in the win case
let line;
//Random square for cpu mode
let randomSquare;
//To control when the automatic placement work
let shouldContinue = true;
//Trace player 1 moves
let player1Moves = [];
let possibs = [];
let possib;
let theSquare;
let winMoves;

//Get every individual square
const square1 = document.querySelector(".one");
const square2 = document.querySelector(".two");
const square3 = document.querySelector(".three");
const square4 = document.querySelector(".four");
const square5 = document.querySelector(".five");
const square6 = document.querySelector(".six");
const square7 = document.querySelector(".seven");
const square8 = document.querySelector(".eight");
const square9 = document.querySelector(".nine");

//Get every individual line
const line1 = document.querySelector(".line_1");
const line2 = document.querySelector(".line_2");
const line3 = document.querySelector(".line_3");
const line4 = document.querySelector(".line_4");
const line5 = document.querySelector(".line_5");
const line6 = document.querySelector(".line_6");
const line7 = document.querySelector(".line_7");
const line8 = document.querySelector(".line_8");

//Set the win possibilities
const possibilities = {
  possibility1: [line1, [square1, square2, square3]],
  possibility2: [line2, [square4, square5, square6]],
  possibility3: [line3, [square7, square8, square9]],
  possibility4: [line4, [square1, square4, square7]],
  possibility5: [line5, [square2, square5, square8]],
  possibility6: [line6, [square3, square6, square9]],
  possibility7: [line7, [square1, square5, square9]],
  possibility8: [line8, [square3, square5, square7]],
};

//PLayers
const player1 = {
  score: 0,
};

const player2 = {
  score: 0,
};
//! ----------- Functions -----------
//* Choose mode Functions
//To check if the second input exist or not
const secondInputParent = document.querySelector(".cpu_case").closest(".start");
const secondInput = document.querySelector(".cpu_case");
let secondInputExistence = secondInputParent.querySelector(".cpu_case");
function chooseMode() {
  const checked = gameMode.querySelector(
    ".game_mode .mode div:has(input:checked)"
  );
  if (checked.className == "single") {
    shouldContinue = true;
    chosenMode("single");
    startGame.querySelector(" .names > :first-child label").innerHTML =
      "Enter Your Name";
    //Set the opposite mode in the switch button based on the selected one
  } else if (checked.className == "multi") {
    chosenMode("multi");
  }
}
function chosenMode(mode) {
  //Remove the class that fixes the body's height
  document.body.classList.remove("initial");
  gameMode.classList.remove("show");
  startGame.classList.add("show");
  //remove secondInput & check for it's existence and update the first one based on the mode
  player1NameInput.focus();
  mode == "single"
    ? secondInputParent.firstElementChild.removeChild(secondInput)
    : secondInputParent.firstElementChild.appendChild(secondInput);
  secondInputExistence = secondInputParent.querySelector(".cpu_case");
  //Set the opposite mode in the switch button based on the selected one
  currentModeField.innerHTML = "";
  mode == "single"
    ? currentModeField.insertAdjacentHTML(
        "afterbegin",
        "&nbsp; Multi PLayer <i class='fa-solid fa-user-group'></i>"
      )
    : currentModeField.insertAdjacentHTML(
        "afterbegin",
        "&nbsp; Single PLayer <i class='fa-solid fa-microchip'></i>"
      );
}
//* Placing Marks Function
function placeMark() {
  if (activePlayer == 0) currentMark = player1.mark;
  else if (activePlayer == 1) currentMark = player2.mark;
  //Check if the currentMark is true or false
  this.firstElementChild.classList.add(currentMark);
  //Remove the event to make sure that every element get only one click event
  //! No need for all of this just {once : true} does the job
  // alreadyClicked.push(this);
  // this.removeEventListener("click", placeMark);
  //Trace the player1Moves
  if (activePlayer == 0) player1Moves.push(this);

  //Change the currentMark
  activePlayer = activePlayer == 0 ? 1 : 0;
  //Set the active player class
  player_1.classList.toggle("player_active");
  player_2.classList.toggle("player_active");
  //To Check if all the squares are full
  if (player2.name == "Computer") {
    if (player_2.classList.contains("player_active")) {
      setTimeout(switchToCPU, 700);
    }
  }
  number++;
  if (number === 9) {
    winMsg.classList.add("show");
    winMsg.firstElementChild.firstElementChild.innerHTML = "Draw!";
    winMsg.firstElementChild.querySelector("div").style.display = "none";
  }
  //Check for win possibility
  for (const key in possibilities) {
    let possibility = possibilities[key];
    //Check for the first possibility that all its squares have the same mark
    if (
      possibility[1].every((e) =>
        e.firstElementChild.classList.contains(currentMark)
      )
    ) {
      if (player2.name == "Computer") shouldContinue = false;
      line = possibility[0];
      line.classList.add("win");
      line.style.opacity = "1";
      //Get the winner
      const players = [player1, player2];
      const winnerPlayer = players.find((e) => e.mark == currentMark);
      winnerPlayer.score++;
      //empty the class so that if there is an old one it get removed
      winner.className = "";
      //Add current mark class
      winner.classList.add(currentMark);
      //Win msg
      winMsg.firstElementChild.firstElementChild.innerHTML = "You Won!";
      winMsg.firstElementChild.querySelector("div").style.display = "flex";
      winMsg.classList.add("show");
    }
  }
}

//* Game Function
function mainFunction() {
  choice.classList.remove("show");
  squares.forEach((square) => {
    square.addEventListener("click", placeMark, { once: true });
  });
  //Set the names and marks
  player1NameField.textContent = player1.name;
  player2NameField.textContent = player2.name;
  player1MarkField.className = player1.mark;
  player2MarkField.className = player2.mark;
  //Retry
  retryBtn.addEventListener("click", () => {
    retryMsg.classList.add("show");
    retryMsg.addEventListener("click", function (e) {
      if (e.target.classList.contains("yes")) {
        reset();
        this.classList.remove("show");
      } else if (e.target.classList.contains("no")) {
        this.classList.remove("show");
      }
    });
  });
}
//* Reset Function
function reset() {
  //Reset active player class to the first player
  activePlayer = 0;
  player_1.classList.add("player_active");
  player_2.classList.remove("player_active");
  //Reset scores and rounds number
  currentRound = 1;
  player1.score = player2.score = 0;
  player1ScoreField.textContent = player2ScoreField.textContent = 0;
  roundNumber.textContent = currentRound;
  //reset the number to Check if the game ended
  number = 0;
  //Restore the event on the elements and remove marks
  removeMarksAndRestoreEvents();
}
//* Remove Marks and Restore Events
function removeMarksAndRestoreEvents() {
  //Restore the event on the elements
  // alreadyClicked.forEach((e) => e.addEventListener("click", placeMark));
  //Restore the event on the elements
  squares.forEach((square) => {
    square.addEventListener("click", placeMark, { once: true });
  });
  //remove the classes from all squares = remove marks
  squares.forEach((square) => {
    square.firstElementChild.classList.remove("x", "o");
  });
  //Remove line
  if (line) {
    line.classList.remove("win");
    line.style.opacity = "0";
  }
}
//* Set Scores
function setScores() {
  player1ScoreField.textContent = player1.score;
  player2ScoreField.textContent = player2.score;
  winMsg.classList.remove("show");
}
//* Start Game Function
function startGameFunction() {
  const onlyLetters = new RegExp("^[a-zA-Z ]+$");
  //To check if there is one name input field (single)
  let namesInputs = secondInputExistence
    ? [player1NameInput, player2NameInput]
    : [player1NameInput];
  //Check if the names are valid
  if (namesInputs.every((name) => onlyLetters.test(name.value))) {
    startGame.classList.remove("show");
    choice.classList.add("show");
    player1.name = player1NameInput.value;
    player2.name = secondInputExistence ? player2NameInput.value : "Computer";
  } else if (
    window.confirm("Only Letters Are Allowed As Names.Please Try Again")
  ) {
    const invalidNames = namesInputs.filter(
      (name) => !onlyLetters.test(name.value)
    );
    invalidNames.forEach((input) => {
      input.value = "";
      invalidNames[0].focus();
    });
  } else {
    window.open("file:///W:/JavaScript/XO/cancel.html");
  }
}
//* Choose Marks Function
function choose() {
  const checked = choice.querySelector(".choices div:has(input:checked)");
  checked.dataset.mark == "x"
    ? ((player1.mark = "x"), (player2.mark = "o"))
    : ((player1.mark = "o"), (player2.mark = "x"));
  player_1.classList.add("player_active");
  mainFunction();
}
//* Single Mode (CPU)
function switchToCPU() {
  if (!shouldContinue || number == 9) return;
  check();
  function check() {
    let lastSquare = player1Moves.length - 1;
    let preLastSquare = player1Moves.length - 2;
    winMoves = [player1Moves[lastSquare], player1Moves[preLastSquare]];
    for (let i = 0; i < player1Moves.length; i++) {
      lastSquare--;
      preLastSquare--;
    }
    for (const poss in possibilities) {
      const posses = possibilities[poss][1];
      possibs.push(posses);
    }
    possib = new Set(
      possibs
        .filter((poss) => {
          return winMoves.every((move) => poss.includes(move));
        })
        .flat()
    );
    theSquare = new Set([...possib].filter((el) => !winMoves.includes(el)));
  }
  c(theSquare);
  c(possib);
  c(player1Moves);
  c(winMoves);
  const ev = new Event("click");
  // if (possib.size == 0) {
  do {
    randomSquare =
      possib.size == 0 ||
      [...theSquare][0].firstElementChild.classList.contains("x") ||
      [...theSquare][0].firstElementChild.classList.contains("x")
        ? squares[Math.floor(Math.random() * squares.length)]
        : [...theSquare][0];
  } while (
    randomSquare.firstElementChild.classList.contains("x") ||
    randomSquare.firstElementChild.classList.contains("o")
  );
  // } else {
  //   randomSquare = [...theSquare][0];
  // }
  randomSquare.dispatchEvent(ev);
}
//* Switch Modes
function switchMode() {
  if (single.checked) {
    multi.checked = true;
    chosenMode("multi");
  } else if (multi.checked) {
    single.checked = true;
    shouldContinue = true;
    chosenMode("single");
  }
  reset();
  player1NameInput.value = player2NameInput.value = "";
  xMark.checked = oMark.checked = false;
  finalWinnerMsg.classList.remove("show");
  startGame.classList.add("show");
}

//! ----------- Events -----------
//* Choose mode
chooseModeBtn.addEventListener("click", chooseMode);
//Choose using keyboard
const single = document.querySelectorAll("input[name='mode']")[0];
const multi = document.querySelectorAll("input[name='mode']")[1];
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft") single.checked = true;
  if (e.key == "ArrowRight") multi.checked = true;
});
document.addEventListener("keydown", (e) => {
  if (gameMode.classList.contains("show")) if (e.key == "Enter") chooseMode();
});
//* Start
//Move to the choice modal after clicking start button
startGameBtn.addEventListener("click", startGameFunction);
player1NameInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter")
    if (this.value.length > 0)
      secondInputExistence ? player2NameInput.focus() : startGameFunction();
});
player2NameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") startGameFunction();
});

//* Choice
//Setting the currentMark based on the choice and start the game
choice.addEventListener("click", (e) => {
  if (e.target == confirmChoice) choose();
});
//Choose using keyboard
const xMark = document.querySelectorAll("input[name='choice']")[0];
const oMark = document.querySelectorAll("input[name='choice']")[1];
document.addEventListener("keydown", (e) => {
  if (choice.classList.contains("show")) {
    if (e.key == "x") xMark.checked = true;
    if (e.key == "o") oMark.checked = true;
  }
});
document.addEventListener("keydown", (e) => {
  if (choice.classList.contains("show"))
    if (e.key == "Enter") {
      //To blur from the inputs so that when i click x/o it doesn't get added
      player1NameInput.blur();
      player2NameInput.blur();
      choose();
    }
});
//* Winning
winMsg.addEventListener("click", (e) => {
  if (e.target.classList.contains("next_round")) {
    //Restart CPU Function
    if (player2.name == "Computer") {
      shouldContinue = true;
      if (player_2.classList.contains("player_active")) {
        setTimeout(switchToCPU, 700);
      }
    }
    //Reset single the mode values
    player1Moves = winMoves = theSquare =  [];

    //Increment the round number and set it
    currentRound++;
    roundNumber.textContent = +currentRound;
    setScores();
    //reset
    number = 0;
    removeMarksAndRestoreEvents();
  }
  if (e.target.classList.contains("quit")) {
    setScores();
    finalWinnerPLayer.innerHTML = "";
    finalWinnerPLayer.insertAdjacentHTML(
      "afterbegin",
      player1.score > player2.score
        ? `<span class="final_winner_player">${player1.name}</span> Is The Final Winner`
        : player1.score < player2.score
        ? `<span class="final_winner_player">${player2.name}</span> Is The Final Winner`
        : `There  Is No Final Winner`
    );

    finalWinnerMsg.classList.add("show");
  }
});

//* Start a new game
newGameBtn.addEventListener("click", () => {
  finalWinnerMsg.classList.remove("show");
  reset();
  mainFunction();
  shouldContinue = true;
});

//* Switch Mode
currentModeField.parentElement.addEventListener("click", switchMode);
