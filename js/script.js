const lettersGuessed = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const response = await fetch(`https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt`);
    const words = await response.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    placeholder(word);
};


getWord();

const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        // console.log(letter);
        placeholderLetters.push("●")
    }
    wordInProgress.innerText = placeholderLetters.join("");
};


guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    message.innerText = "";
    const guess = letterInput.value;
    const goodGuess = validateInput(guess);
    if (goodGuess) {
        makeGuess(guess);
    }
    letterInput.value = "";
});

const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter.";
    }   else if (input.length > 1) {
        message.innerText = "Please enter only one single letter.";
    }   else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a letter from A to Z.";
    }   else {
        return input;
    }       
};

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "That letter has been guessed! Please try a different letter!";
    }   else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        updatedGuessesLeft(guess);
        showLettersGuessed();
        updateLettersGuessed(guessedLetters);
    }
};

const showLettersGuessed = function () {
    lettersGuessed.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        lettersGuessed.append(li);
    } 
};

const updateLettersGuessed = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const answerReveal = [];

    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            answerReveal.push(letter.toUpperCase());
        } else {
            answerReveal.push("●");
        }
    }
    // console.log(answerReveal);
    wordInProgress.innerText = answerReveal.join("");
    checkIfWin();
};

const updatedGuessesLeft = function (guess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)) {
        message.innerText = `Sorry! This word has no ${guess}.`;
        remainingGuesses -= 1;
    } else {
        message.innerText = `Great guess! The word has the letter ${guess}.`;

    }

    if (remainingGuesses === 0) {
        message.innerHTML = `Game Over! The correct word was <span class=
        "highlight">${word}.</span>`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};


const checkIfWin = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">Congratulations!! You guessed the correct word! </p>`;
        startOver();
    }
};

const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    lettersGuessed.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function () {
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses.`;
    lettersGuessed.innerHTML = "";
    message.innerText = "";

    getWord();


    guessButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesElement.classList.remove("hide");
    lettersGuessed.classList.remove("hide");

});