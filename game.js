const gameContainer = document.querySelector('#game');
const cell = document.createElement('div');
const textNode = document.createTextNode('Hell, world!')
cell.appendChild(textNode);
gameContainer.appendChild(cell);

let onClick = function onClick() {
  cell.textContent = 'Clicked';
};

cell.addEventListener('click', onClick);
