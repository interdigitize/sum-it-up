const {getRange} = require('../array-util');
describe('array-util', () => {
  describe('getRange()', () => {
    it('produces a valid range starting with 0', () =>{
      expect(getRange(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });
});
