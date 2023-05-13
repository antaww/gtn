document.addEventListener('DOMContentLoaded', () => {
    const maxGuesses = 8;

    function generateTable() {
        const tableBody = document.querySelector('tbody');
        for (let i = 0; i < maxGuesses; i++) {
            const tableRow = document.createElement('tr');
            tableRow.setAttribute('role', 'row');
            if (i === 0) {
                tableRow.classList.add('current-row');
            }
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

    generateKeyboard();
    generateTable();

    const keyboardButtons = document.querySelectorAll('.keyboard-button');

    keyboardButtons.forEach(keyboardButton => {
        keyboardButton.addEventListener('click', () => {
            const currentRow = document.querySelector('.current-row');
            const currentCell = currentRow.querySelector('[data-cell="guess"]');
            if (keyboardButton.dataset.key === 'backspace') {
                if (currentCell.textContent.length > 0) {
                    currentCell.textContent = currentCell.textContent.slice(0, -1);
                }
            } else if (keyboardButton.dataset.key === 'done') {
                if (currentCell.textContent.length === 4) {
                    currentRow.classList.remove('current-row');
                    if (currentRow.nextElementSibling) {
                        currentRow.nextElementSibling.classList.add('current-row');
                    } else {
                        //todo: game over
                        console.log('game over')
                    }
                }
            } else {
                if (currentCell.textContent.length < 4) {
                    currentCell.textContent += keyboardButton.dataset.key;
                    //todo: check if the number is already in the guess
                }
            }
        });
    });

    //todo: reduce backspace / done opacity when not available
});