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
    this.sumRowEl = document.querySelector('.sum-row'); // defined here (see line 99)
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

  createColArrays(cellPosition, value, obj){
    obj[cellPosition] = [];
    console.log('value: ', value);
    obj[cellPosition].push(value); //Why is this adding a key Value pair and not just the value?
    return obj;
  }


  renderTableBody(){
    const fragment = document.createDocumentFragment();
    const emptyObj = {};
    for(let row = 0; row < this.model.numRows; row++){
      const tr = createTR();
      for(let col = 0; col < this.model.numCols; col++){
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const ObjofColValues = this.createColArrays(position.col, value, emptyObj);
        const td = createTD(value);
        if(this.isCurrentCell(col, row)){
          td.className = 'current-cell';
        }
        tr.appendChild(td);
        console.log(ObjofColValues);

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
    this.sheetBodyEl.appendChild(tr); // If I change this to this.sumRowEl.appendChild(tr); It logs null in the console. Why is that? Since it is defined on 20.
  }



  attachEventHandlers(){
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
  }

  handleFormulaBarChange(evt){
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderSumRow();
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
