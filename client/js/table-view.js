const { getLetterRange } = require('./array-util');
const { removeChildren, createTR, createTH, createTD } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
  }

  init(){
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences(){
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY')
    this.formulaBarEl = document.querySelector('#formula-bar');
  }

  initCurrentCell() {
    this.currentCellLocation = { col: 0, row: 0};
    this.renderFormulaBar();
  }

  normalizeValueForRendering(value){
    return value || '';
  }

  renderFormulaBar(){
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }

  renderTable(){
    this.renderTableHeader();
    this.renderTableBody();
    this.renderSumRow();
  }

  renderTableHeader(){
    removeChildren(this.headerRowEl);
    getLetterRange('A', this.model.numCols)
      .map(colLabel => createTH(colLabel))
      .forEach(th => this.headerRowEl.appendChild(th));
  }

  isCurrentCell(col, row){
    return this.currentCellLocation.col === col &&
           this.currentCellLocation.row === row;
  }

  renderTableBody(){
    const fragment = document.createDocumentFragment();
    for(let row = 0; row < this.model.numRows; row++){
      const tr = createTR();
      for(let col = 0; col < this.model.numCols; col++){
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);
        if(this.isCurrentCell(col, row)){
          td.className = 'current-cell';
        }

        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }

    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);
  }

  renderSumRow(){
    const tr = createTR();
    for(let col = 0; col < this.model.numCols; col++){
      const position = {col: col};
      const value = this.model.getValue(position);
      const td = createTD(value);
      tr.appendChild(td);
      td.className = 'sum-row';
    }
    this.sheetBodyEl.appendChild(tr);

    this.sumRowEl = document.querySelectorAll('.sum-row');

  }

  attachEventHandlers(){
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleSumColumnUpdate.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
  }

  handleFormulaBarChange(evt){
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderSumRow();
  }

  handleSumColumnUpdate(evt){
    this.sumRowEl.col = this.currentCellLocation.col;
    let sumRowCellValue = this.model.getValue(this.sumRowEl);
    let value = parseInt(this.formulaBarEl.value, 10);

    if(sumRowCellValue === undefined){
      if(typeof(value) === 'number' && !isNaN(value)){
        this.model.setValue(this.sumRowEl, value);
      }else if(isNaN(value)){
        sumRowCellValue = undefined;
        this.model.setValue(this.sumRowEl, sumRowCellValue);
      }
    } else {
      if(isNaN(value)){
        sumRowCellValue = parseInt(sumRowCellValue, 10);
        this.model.setValue(this.sumRowEl, sumRowCellValue);
      }else{
        sumRowCellValue = parseInt(sumRowCellValue, 10) + parseInt(this.formulaBarEl.value, 10);
        this.model.setValue(this.sumRowEl, sumRowCellValue);
      }
    }
  }

  handleSheetClick(evt){
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;
    this.currentCellLocation = { col: col, row: row};
    this.renderTableBody();
    this.renderSumRow();
    this.renderFormulaBar();
  }
}

module.exports = TableView;
