/*
  Name: Jalen Higgins
  Date: 09.30.2025
  CSC 372-01

  Script for Assignment 5 – Rock, Paper, Scissors
  Guide compliance:
  - JSDoc comments for functions
  - Use let (no var)
  - Event listeners (no inline JS)
  - Avoid innerHTML except for clearing (not used)
*/

(() => {
  "use strict";

  /*** DOM cache ***/
  /** @type {HTMLElement[]} */
  let choices = Array.from(document.querySelectorAll(".choice"));
  /** @type {HTMLImageElement} */ let computerImg = document.getElementById("computer-img");
  /** @type {HTMLElement} */      let computerCaption = document.getElementById("computer-caption");
  /** @type {HTMLElement} */      let thinkingNote = document.getElementById("thinking-note");
  /** @type {HTMLElement} */      let resultEl = document.getElementById("result");
  /** @type {HTMLElement} */      let winsEl = document.getElementById("wins");
  /** @type {HTMLElement} */      let lossesEl = document.getElementById("losses");
  /** @type {HTMLElement} */      let tiesEl = document.getElementById("ties");
  /** @type {HTMLButtonElement} */let resetBtn = document.getElementById("reset-btn");

  /*** State ***/
  /** @type {Array<"rock"|"paper"|"scissors">} */
  let MOVES = ["rock", "paper", "scissors"];
  let IMG = {
    rock: "img/rock.png",
    paper: "img/paper.png",
    scissors: "img/scissors.png",
    question: "img/question-mark.png",
  };

  /** prevent clicks while computer is thinking */
  let locked = false;

  /** @typedef {{wins:number, losses:number, ties:number}} Scores */
  /** @type {Scores} */
  let scores = { wins: 0, losses: 0, ties: 0 };

  /**
   * Toggle selection highlight on the player's chosen move.
   * @param {"rock"|"paper"|"scissors"|""} move - The move to mark selected (or "" to clear).
   * @returns {void}
   */
  function setSelected(move) {
    choices.forEach(fig => {
      let isSel = fig.dataset.move === move;
      fig.classList.toggle("selected", isSel);
      fig.setAttribute("aria-pressed", String(isSel));
    });
  }

  /**
   * Choose a random computer move.
   * @returns {"rock"|"paper"|"scissors"}
   */
  function randomMove() {
    let idx = Math.floor(Math.random() * MOVES.length);
    return MOVES[idx];
  }

  /**
   * Determine winner given player and computer moves.
   * @param {"rock"|"paper"|"scissors"} player
   * @param {"rock"|"paper"|"scissors"} computer
   * @returns {"player"|"computer"|"tie"}
   */
  function winner(player, computer) {
    if (player === computer) return "tie";
    let win =
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper");
    return win ? "player" : "computer";
  }

  /**
   * Update the scoreboard counts and UI.
   * @param {"player"|"computer"|"tie"} result
   * @returns {void}
   */
  function updateScore(result) {
    if (result === "player") scores.wins++;
    else if (result === "computer") scores.losses++;
    else scores.ties++;

    winsEl.textContent = String(scores.wins);
    lossesEl.textContent = String(scores.losses);
    tiesEl.textContent = String(scores.ties);
  }

  /** Reset UI and scores to initial state.
   *  @returns {void}
   */
  function resetAll() {
    scores = { wins: 0, losses: 0, ties: 0 };
    winsEl.textContent = "0";
    lossesEl.textContent = "0";
    tiesEl.textContent = "0";

    resultEl.textContent = "Make a selection to begin.";
    computerImg.setAttribute("src", IMG.question);
    computerImg.setAttribute("alt", "Computer is thinking");
    computerCaption.textContent = "Thinking…";
    thinkingNote.textContent = "Ready.";
    setSelected(""); // clear selection
    locked = false;
  }

  /**
   * Animate computer "thinking" for 3s (shuffle every 500ms) then reveal a move.
   * @param {"rock"|"paper"|"scissors"} playerMove
   * @returns {void}
   */
  function computerThinkThenPlay(playerMove) {
    locked = true;
    let ticks = 0;
    computerCaption.textContent = "Thinking…";
    thinkingNote.textContent = "Shuffling…";
    resultEl.textContent = " ";

    let interval = setInterval(() => {
      let m = MOVES[ticks % 3];
      computerImg.setAttribute("src", IMG[m]);
      computerImg.setAttribute("alt", `Shuffling: ${m}`);
      ticks++;
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      let comp = randomMove();
      computerImg.setAttribute("src", IMG[comp]);
      computerImg.setAttribute("alt", `Computer chose ${comp}`);
      computerCaption.textContent = comp[0].toUpperCase() + comp.slice(1);

      let outcome = winner(playerMove, comp);
      if (outcome === "player") {
        resultEl.textContent = "You win! 🎉";
      } else if (outcome === "computer") {
        resultEl.textContent = "Computer wins. 😤";
      } else {
        resultEl.textContent = "It's a tie. 🤝";
      }
      updateScore(outcome);
      thinkingNote.textContent = "Ready.";
      locked = false;
    }, 3000);
  }

  /**
   * Handle user activating a choice via mouse/keyboard.
   * @param {"rock"|"paper"|"scissors"} move
   * @returns {void}
   */
  function onChoiceActivated(move) {
    if (locked) return;
    setSelected(move);
    computerImg.setAttribute("src", IMG.question);
    computerImg.setAttribute("alt", "Computer is thinking");
    computerCaption.textContent = "Thinking…";
    thinkingNote.textContent = "Shuffling…";
    computerThinkThenPlay(move);
  }

  /*** Event bindings ***/
  choices.forEach(fig => {
    fig.addEventListener("click", () => onChoiceActivated(fig.dataset.move));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChoiceActivated(fig.dataset.move);
      }
    });
  });

  document.getElementById("reset-btn").addEventListener("click", resetAll);

  // Initial state
  resetAll();
})();
