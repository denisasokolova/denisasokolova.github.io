const introScreen = document.querySelector("#intro-screen");
const gameScreen = document.querySelector("#game-screen");
const numberGameScreen = document.querySelector("#number-game-screen");

const birthdayName = document.querySelector("#birthday-name");
const birthdayAge = document.querySelector("#birthday-age");
const gameName = document.querySelector("#game-name");

const introMeme = document.querySelector("#intro-meme");
const memeText = document.querySelector("#meme-text");

const nextMemeButton = document.querySelector("#next-meme-button");
const startGameButton = document.querySelector("#start-game-button");
const restartButton = document.querySelector("#restart-button");

const bingoBoard = document.querySelector("#bingo-board");
const gameStatus = document.querySelector("#game-status");

const winModal = document.querySelector("#win-modal");
const continueButton = document.querySelector("#continue-button");
const closeModalButton = document.querySelector("#close-modal-button");

const numberBingoBoard = document.querySelector("#number-bingo-board");
const currentNumber = document.querySelector("#current-number");
const countdownElement = document.querySelector("#countdown");

const pauseDrawButton = document.querySelector("#pause-draw-button");

const newNumberCardButton = document.querySelector(
    "#new-number-card-button"
);

const drawnNumbersContainer = document.querySelector(
    "#drawn-numbers"
);

const numberGameStatus = document.querySelector(
    "#number-game-status"
);

const numberWinModal = document.querySelector(
    "#number-win-modal"
);

const playAgainButton = document.querySelector(
    "#play-again-button"
);

const closeNumberModalButton = document.querySelector(
    "#close-number-modal-button"
);


/* NASTAVENÍ RYCHLOSTI */

const drawDelay = 8;


/* PROMĚNNÉ */

let currentMemeIndex = 0;

let selectedCells = [];
let memeGameHasBeenWon = false;

let selectedNumberCells = [];
let drawnNumbers = [];
let availableNumbers = [];

let numberGameHasBeenWon = false;
let autoDrawIsRunning = false;

let countdownValue = drawDelay;
let countdownInterval = null;


/* VTIPNÉ HLÁŠKY */

const seniorMessages = [
    "Mikey hledá číslo. Dejme mu chvíli.",
    "Kontrola zraku po čtvrtym pivu.",
    "Mikey si musí nejdřív nasadit brýle.",
    "Klid. Ve dvaceti už reflexy nejsou, co bývaly.",
    "Číslo se losuje důchodcovským tempem neboj.",
    "Mikey právě dopíjí pivko.",
    "Prosím nerušit. Senior se soustředí.",
    "Už je starej,prostě to trvá no...",
    "Mikey tvrdí, že to číslo určitě už padlo.",
    "Chvilku strpení. Bolí ho záda.",
    "Mikey potřebuje čas. Už mu přece není devatenáct.",
    "Kontrolujeme, jestli číslo není moc malé na přečtení.(JE)"
];


/* ZÁKLADNÍ NASTAVENÍ */

function setGameInformation() {
    birthdayName.textContent = gameData.name;
    birthdayAge.textContent = gameData.age;
    gameName.textContent = gameData.name;

    document.title = `${gameData.name} – Old Man Bingo`;
}


/* MEME ÚVOD */

function showMeme(index) {
    const meme = gameData.memes[index];

    introMeme.src = meme.image;
    introMeme.alt = meme.text;
    memeText.textContent = meme.text;
}

function showNextMeme() {
    currentMemeIndex++;

    if (currentMemeIndex >= gameData.memes.length) {
        currentMemeIndex = 0;
    }

    showMeme(currentMemeIndex);
}


/* OBRAZOVKY */

function hideAllScreens() {
    introScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    numberGameScreen.classList.remove("active");
}

function startMemeGame() {
    hideAllScreens();

    gameScreen.classList.add("active");

    createMemeBingoBoard();
}

function startNumberGame() {
    winModal.classList.remove("visible");

    hideAllScreens();

    numberGameScreen.classList.add("active");

    createNumberBingoGame();
}


/* POMOCNÉ FUNKCE */

function shuffleArray(array) {
    const copiedArray = [...array];

    for (let i = copiedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(
            Math.random() * (i + 1)
        );

        [
            copiedArray[i],
            copiedArray[randomIndex]
        ] = [
            copiedArray[randomIndex],
            copiedArray[i]
        ];
    }

    return copiedArray;
}

function getRandomNumbers(min, max, amount) {
    const numbers = [];

    for (let number = min; number <= max; number++) {
        numbers.push(number);
    }

    return shuffleArray(numbers).slice(0, amount);
}

function getRandomSeniorMessage() {
    const randomIndex = Math.floor(
        Math.random() * seniorMessages.length
    );

    return seniorMessages[randomIndex];
}


/* VÝHERNÍ KOMBINACE */

const winningCombinations = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],

    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],

    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
];


/* PRVNÍ ÚROVEŇ */

function createMemeBingoBoard() {
    bingoBoard.innerHTML = "";

    selectedCells = [];
    memeGameHasBeenWon = false;

    gameStatus.textContent =
        "Zatím žádný bingo. Mikey se musí víc snažit.";

    const items = shuffleArray(
        gameData.bingoItems
    ).slice(0, 25);

    items.forEach(function (item, index) {
        const cell = document.createElement("button");

        cell.type = "button";
        cell.classList.add("bingo-cell", "text-cell");
        cell.textContent = item;

        if (item.toLowerCase().includes("free")) {
            cell.classList.add(
                "selected",
                "free-cell"
            );

            selectedCells.push(index);
        }

        cell.addEventListener("click", function () {
            toggleMemeCell(cell, index);
        });

        bingoBoard.appendChild(cell);
    });

    checkMemeBingo();
}

function toggleMemeCell(cell, index) {
    if (cell.classList.contains("free-cell")) {
        return;
    }

    cell.classList.toggle("selected");

    if (cell.classList.contains("selected")) {
        if (!selectedCells.includes(index)) {
            selectedCells.push(index);
        }
    } else {
        selectedCells = selectedCells.filter(
            function (selectedIndex) {
                return selectedIndex !== index;
            }
        );
    }

    checkMemeBingo();
}

function checkMemeBingo() {
    const winningCombination = winningCombinations.find(
        function (combination) {
            return combination.every(function (index) {
                return selectedCells.includes(index);
            });
        }
    );

    if (
        winningCombination &&
        !memeGameHasBeenWon
    ) {
        memeGameHasBeenWon = true;

        highlightWinningCells(
            bingoBoard,
            winningCombination
        );

        gameStatus.textContent =
            "BINGO! Stáří bylo úspěšně potvrzeno.";

        winModal.classList.add("visible");
    }
}


/* DRUHÁ ÚROVEŇ */

function createNumberBingoGame() {
    stopAutoDraw();

    numberBingoBoard.innerHTML = "";

    selectedNumberCells = [];
    drawnNumbers = [];
    availableNumbers = [];

    numberGameHasBeenWon = false;
    countdownValue = drawDelay;

    currentNumber.textContent = "–";
    countdownElement.textContent = countdownValue;

    drawnNumbersContainer.textContent =
        "Zatím nebylo vylosovaný žádný číslo.";

    numberGameStatus.textContent =
        "Klikni na „Probudit Mikeyho“ a přines mu radši pivko.";

    pauseDrawButton.textContent = "🍺 Probudit Mikeho";

    createAvailableNumbers();
    createNumberCard();
}

function createAvailableNumbers() {
    for (let number = 1; number <= 75; number++) {
        availableNumbers.push(number);
    }

    availableNumbers = shuffleArray(
        availableNumbers
    );
}

function createNumberCard() {
    const columns = [
        getRandomNumbers(1, 15, 5),
        getRandomNumbers(16, 30, 5),
        getRandomNumbers(31, 45, 5),
        getRandomNumbers(46, 60, 5),
        getRandomNumbers(61, 75, 5)
    ];

    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 5; column++) {
            const cellIndex = row * 5 + column;

            const cell = document.createElement("button");

            cell.type = "button";

            cell.classList.add(
                "bingo-cell",
                "number-cell"
            );

            if (cellIndex === 12) {
                cell.textContent = "FREE";

                cell.classList.add(
                    "selected",
                    "free-cell"
                );

                selectedNumberCells.push(cellIndex);
            } else {
                const number = columns[column][row];

                cell.textContent = number;
                cell.dataset.number = number;
            }

            cell.addEventListener("click", function () {
                toggleNumberCell(cell, cellIndex);
            });

            numberBingoBoard.appendChild(cell);
        }
    }
}

function toggleNumberCell(cell, index) {
    if (cell.classList.contains("free-cell")) {
        return;
    }

    const cellNumber = Number(
        cell.dataset.number
    );

    if (!drawnNumbers.includes(cellNumber)) {
        numberGameStatus.textContent =
            `Číslo ${cellNumber} ještě nebylo vylosováno. Mikey už asi špatně slyší.`;

        cell.classList.add("wrong-cell");

        setTimeout(function () {
            cell.classList.remove("wrong-cell");
        }, 350);

        return;
    }

    cell.classList.toggle("selected");

    if (cell.classList.contains("selected")) {
        if (!selectedNumberCells.includes(index)) {
            selectedNumberCells.push(index);
        }

        numberGameStatus.textContent =
            `Číslo ${cellNumber} označeno. Mikey to zatím zvládá.`;
    } else {
        selectedNumberCells =
            selectedNumberCells.filter(
                function (selectedIndex) {
                    return selectedIndex !== index;
                }
            );

        numberGameStatus.textContent =
            `Číslo ${cellNumber} bylo odškrtnuto. Mikey se asi spletl.`;
    }

    checkNumberBingo();
}


/* AUTOMATICKÉ LOSOVÁNÍ */

function toggleAutoDraw() {
    if (autoDrawIsRunning) {
        stopAutoDraw();

        numberGameStatus.textContent =
            "😴 Mikey usnul. Losování je pozastavené.";
    } else {
        startAutoDraw();

        numberGameStatus.textContent =
            "🍺 Mikey je vzhůru. Losování začíná.";
    }
}

function startAutoDraw() {
    if (
        autoDrawIsRunning ||
        numberGameHasBeenWon
    ) {
        return;
    }

    autoDrawIsRunning = true;

    pauseDrawButton.textContent =
        "😴 Uložit Mikeho ke spánku";

    countdownValue = drawDelay;
    countdownElement.textContent = countdownValue;

    countdownInterval = setInterval(function () {
        countdownValue--;

        countdownElement.textContent =
            countdownValue;

        if (countdownValue <= 0) {
            drawNumber();

            countdownValue = drawDelay;

            countdownElement.textContent =
                countdownValue;
        }
    }, 1000);
}

function stopAutoDraw() {
    autoDrawIsRunning = false;

    pauseDrawButton.textContent =
        "🍺 Probudit Mikeyho";

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function drawNumber() {
    if (availableNumbers.length === 0) {
        stopAutoDraw();

        currentNumber.textContent = "KONEC";

        numberGameStatus.textContent =
            "Všechna čísla byla vylosována. Mikey může jít spát.";

        return;
    }

    const drawnNumber = availableNumbers.pop();

    drawnNumbers.push(drawnNumber);

    currentNumber.textContent =
        getNumberLabel(drawnNumber);

    updateDrawnNumbersHistory();

    numberGameStatus.textContent =
        `${getRandomSeniorMessage()} Padlo ${getNumberLabel(drawnNumber)}.`;
}

function getNumberLabel(number) {
    if (number <= 15) {
        return `B ${number}`;
    }

    if (number <= 30) {
        return `I ${number}`;
    }

    if (number <= 45) {
        return `N ${number}`;
    }

    if (number <= 60) {
        return `G ${number}`;
    }

    return `O ${number}`;
}

function updateDrawnNumbersHistory() {
    drawnNumbersContainer.innerHTML = "";

    const newestFirst = [...drawnNumbers].reverse();

    newestFirst.forEach(function (number) {
        const item = document.createElement("span");

        item.classList.add("drawn-number-item");
        item.textContent = getNumberLabel(number);

        drawnNumbersContainer.appendChild(item);
    });
}

function checkNumberBingo() {
    const winningCombination = winningCombinations.find(
        function (combination) {
            return combination.every(function (index) {
                return selectedNumberCells.includes(index);
            });
        }
    );

    if (
        winningCombination &&
        !numberGameHasBeenWon
    ) {
        numberGameHasBeenWon = true;

        stopAutoDraw();

        highlightWinningCells(
            numberBingoBoard,
            winningCombination
        );

        numberGameStatus.textContent =
            "BINGO! Mikey si zaslouží vítězný pivo.";

        numberWinModal.classList.add("visible");
    }
}


/* SPOLEČNÉ FUNKCE */

function highlightWinningCells(board, combination) {
    const cells = board.querySelectorAll(
        ".bingo-cell"
    );

    combination.forEach(function (index) {
        cells[index].classList.add(
            "winning-cell"
        );
    });
}


/* TLAČÍTKA */

nextMemeButton.addEventListener(
    "click",
    showNextMeme
);

startGameButton.addEventListener(
    "click",
    startMemeGame
);

restartButton.addEventListener(
    "click",
    createMemeBingoBoard
);

closeModalButton.addEventListener(
    "click",
    function () {
        winModal.classList.remove("visible");
    }
);

continueButton.addEventListener(
    "click",
    startNumberGame
);

pauseDrawButton.addEventListener(
    "click",
    toggleAutoDraw
);

newNumberCardButton.addEventListener(
    "click",
    createNumberBingoGame
);

closeNumberModalButton.addEventListener(
    "click",
    function () {
        numberWinModal.classList.remove("visible");
    }
);

playAgainButton.addEventListener(
    "click",
    function () {
        numberWinModal.classList.remove("visible");

        createNumberBingoGame();
    }
);


/* SPUŠTĚNÍ */

setGameInformation();
showMeme(currentMemeIndex);