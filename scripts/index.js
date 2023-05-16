document.addEventListener('DOMContentLoaded', () => {
    const maxGuesses = 10;

    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('fade-out');
    }, 500);

    setTimeout(() => {
        document.querySelector('.loading-screen').remove();
    }, 1500);

    function generateTable() {
        const tableBody = document.querySelector('tbody');
        for (let i = 0; i < maxGuesses; i++) {
            const tableRow = document.createElement('tr');
            tableRow.setAttribute('role', 'row');
            tableRow.innerHTML = `
                <td data-cell="guess"></td>
                <td data-cell="correct-numbers"></td>
                <td data-cell="correct-positions"></td>
            `;
            tableBody.append(tableRow);
        }
    }

    function generateKeyboard() {
        const keyboardRows = document.querySelectorAll('.keyboard-row');
        const keyboardButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'backspace', '0', 'done'];
        let keyboardButtonIndex = 0;

        for (let i = 0; i < keyboardRows.length; i++) {
            for (let j = 0; j < 3; j++) {
                const keyboardButton = document.createElement('button');
                keyboardButton.setAttribute('type', 'button');
                keyboardButton.setAttribute('data-key', keyboardButtons[keyboardButtonIndex]);
                keyboardButton.classList.add('keyboard-button');
                if (isNaN(keyboardButtons[keyboardButtonIndex] * 1)) { //if the button is not a number
                    const span = document.createElement('span');
                    span.classList.add('material-symbols-outlined');
                    span.textContent = keyboardButtons[keyboardButtonIndex];
                    keyboardButton.append(span);
                } else {
                    keyboardButton.textContent = keyboardButtons[keyboardButtonIndex];
                }
                keyboardRows[i].append(keyboardButton);
                keyboardButtonIndex++;
            }
        }
    }

    //Keyboard & table are generated only when the DOM is loaded.
    generateKeyboard();
    generateTable();

    const keyboardButtons = document.querySelectorAll('.keyboard-button');

    keyboardButtons.forEach(keyboardButton => {
        keyboardButton.addEventListener('click', () => {
            if (game.isRunning) {
                if (keyboardButton.dataset.key === 'backspace') {
                    if (game.currentCell.textContent.length > 0) {
                        game.currentCell.textContent = game.currentCell.textContent.slice(0, -1);
                    }
                } else if (keyboardButton.dataset.key === 'done') {
                    if (game.currentCell.textContent.length === 4) {
                        game.currentRow.classList.remove('current-row');
                        if (game.checkGuess(game.currentRow)) {
                            game.gameWon = true;
                            game.stopGame();
                            return;
                        }
                        if (game.currentRow.nextElementSibling) {
                            game.currentRow.nextElementSibling.classList.add('current-row');
                            game.selectCurrentRow(); // Update currentRow & currentCell
                        } else {
                            game.gameWon = false;
                            game.stopGame();
                        }
                    }
                } else {
                    if (game.currentCell.textContent.length < 4) {
                        if (game.currentCell.textContent.includes(keyboardButton.dataset.key)) return;
                        game.currentCell.textContent += keyboardButton.dataset.key;
                    }
                }
            }
        });
    });

    const game = {
        isRunning: false,
        secret: [],
        guesses: [],
        gameWon: null,
        correctNumbers: 0,
        correctPositions: 0,
        currentRow: null,
        currentCell: null,
        startGame() {
            this.isRunning = true;
            this.generateSecret();
            this.clearTable();
            document.querySelector('.table-header').nextElementSibling.classList.add('current-row');
            this.selectCurrentRow();
        },
        stopGame() {
            openModal();
            this.isRunning = false;
        },
        generateSecret() {
            this.resetProperties();
            while (this.secret.length < 4) {
                const randomNumber = Math.floor(Math.random() * 10);
                if (!this.secret.includes(randomNumber)) {
                    this.secret.push(randomNumber);
                }
            }
        },
        checkGuess(currentRow) {
            const currentGuess = currentRow.querySelector('[data-cell="guess"]').textContent;
            const currentCorrectNumbers = currentRow.querySelector('[data-cell="correct-numbers"]');
            const currentCorrectPositions = currentRow.querySelector('[data-cell="correct-positions"]');
            const currentGuessArray = currentGuess.split('');
            const secretCopy = [...this.secret];
            this.correctNumbers = 0;
            this.correctPositions = 0;

            for (let i = 0; i < currentGuessArray.length; i++) {
                if (secretCopy.includes(currentGuessArray[i] * 1)) {
                    this.correctNumbers++;
                    if (secretCopy.indexOf(currentGuessArray[i] * 1) === i) {
                        this.correctPositions++;
                    }
                }
            }

            currentCorrectNumbers.textContent = this.correctNumbers;
            currentCorrectPositions.textContent = this.correctPositions;
            this.guesses.push(currentGuess);

            return this.correctPositions === 4;
        },
        selectCurrentRow() {
            this.currentRow = document.querySelector('.current-row');
            this.currentCell = this.currentRow.querySelector('[data-cell="guess"]');
        },

        clearTable() {
            const tableRows = document.querySelectorAll('tr:not(.table-header)');
            tableRows.forEach(tableRow => {
                tableRow.querySelector('[data-cell="guess"]').textContent = '';
                tableRow.querySelector('[data-cell="correct-numbers"]').textContent = '';
                tableRow.querySelector('[data-cell="correct-positions"]').textContent = '';
            });
        },
        resetProperties() {
            this.secret = [];
            this.guesses = [];
            this.gameWon = null;
            this.correctNumbers = 0;
            this.correctPositions = 0;
        }
    }

    game.startGame();

    // POPUP

    const popupContainer = document.querySelector('.popup');
    const playAgainButton = document.querySelector('.popup-play-again');
    const popupTitle = document.querySelector('.popup-title');
    const popupSecret = document.querySelector('.popup-secret');
    const popupGuesses = document.querySelector('.popup-guesses');
    const popupGuessesEnd = document.querySelector('.popup-guesses-end');

    function closeModal() {
        popupContainer.close();
        popupContainer.classList.toggle('hidden');
    }

    function openModal() {
        updatePopup();
        popupContainer.classList.toggle('hidden');
        popupContainer.showModal();
    }

    function updatePopup() {
        popupTitle.textContent = game.gameWon ? 'You won!' : 'You lost...';
        popupSecret.textContent = game.secret.join('');
        popupGuesses.innerText = game.guesses.length.toString();
        popupGuessesEnd.innerHTML = game.guesses.length <= 1 ? ' guess' : ' guesses';
    }

    playAgainButton.addEventListener('click', () => {
        closeModal()
        game.startGame();
    });
});