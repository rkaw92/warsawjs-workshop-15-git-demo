'use strict';

class Component {
  getElement() {
    return this._element;
  }
}

class CellComponent extends Component {
  constructor({ location, handleCellClick }) {
    super();
    this._state = 'unknown';
    this._element = document.createElement('td');
    this._element.addEventListener('click', function() {
      handleCellClick({ location });
    });
    this._refresh();
  }

  setState(stateName) {
    this._state = stateName;
    this._refresh();
  }

  _refresh() {
    this._element.textContent = this._state;
    this._element.className = 'cell_' + this._state;
  }
}

class BoardComponent extends Component {
  constructor({ handleCellClick, size = 8 }) {
    super();
    // Create _element, create child cells, append to our element
    this._element = document.createElement('table');
    /**
     * References to cells.
     * @type {Object.<string,CellComponent>}
     */
    this._cells = {};
    for (let rowNumber = 0; rowNumber < size; rowNumber += 1) {
      const rowElement = document.createElement('tr');
      for (let columnNumber = 0; columnNumber < size; columnNumber += 1) {
        const cell = new CellComponent({
          handleCellClick,
          location: { row: rowNumber, column: columnNumber }
        });
        rowElement.appendChild(cell.getElement());
        // Also save a reference to the cell so that it can
        //  be addressed later.
        this._cells[`${rowNumber}x${columnNumber}`] = cell;
      }
      this._element.appendChild(rowElement);
    }
  }

  setCellState(location, state) {
    // Find the appropriate cell, call its setState().
    const key = `${location.row}x${location.column}`;
    this._cells[key].setState(state);
  }
}

// ### Controller ###

class GameController {
  constructor(model) {
    this._model = model;
  }
  handleCellClick({ location }) {
    this._model.fireAt(location);
  }
}

// ### Models ###

class CellModel {
  constructor({ hasShip }) {
    this._hasShip = hasShip;
    this._firedAt = false;
  }

  fire() {
    // Guard clause: do not fire twice on the same cell.
    if (this._firedAt) {
      return undefined;
    }
    this._firedAt = true;
    return (this._hasShip ? 'hit' : 'miss');
  }
}

class BoardModel {
  constructor({ size = 8 } = {}) {
    this._cells = {};
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        this._cells[`${i}x${j}`] = new CellModel({ hasShip: false });
      }
    }
  }

  fireAt(location) {
    const target = this._cells[`${location.row}x${location.column}`];
    const firingResult = target.fire();
    //TODO: Deliver the changes to the view!
  }
}

let myController;
function handleCellClick(...args) {
  myController.handleCellClick.apply(myController, args);
}
const boardView = new BoardComponent({ handleCellClick });
const boardModel = new BoardModel();
myController = new GameController(boardModel);

const boardContainer = document.getElementById('boardContainer');
boardContainer.appendChild(boardView.getElement());
