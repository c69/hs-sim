import assert = require('assert');
import ArrayOfCards from '../classes/ArrayOfCards';

// how is this gonna work with TS ?
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('arrayOfCard.ts should load', function() {
    it('should return array-like object ', function() {
      let a = new ArrayOfCards();
      assert.equal(a.concat(42)[0], 42);
    });
});