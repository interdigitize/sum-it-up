const { removeChildren } = require('../dom-util');

describe('dom-util', () => {
  it('removes one child', () => {
    // set up initial state
    const parent = document.createElement('DIV');
    const child = document.createElement('STRONG');
    parent.appendChild(child);

    //inspect initial state
    expect(parent.childNodes.length).toBe(1);
    expect(parent.childNodes[0]).toBe(child);

    //execute code under test
    removeChildren(parent);

    //inspect resulting state
    expect(parent.childNodes.length).toBe(0);
  });
});
