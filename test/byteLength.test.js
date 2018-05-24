const assert = require('assert');
const { byteLength } = require('../');
const largeStr = new Array(4096 + 1).join('-');

const TEST_STRINGS = [
  largeStr,
  '123465',
  'foobar',
  'abcdefghijklmnopqrstuvwxyz',
  'gsdfhan$%^&*(sdgsdnhshcs',
  'abc{foobar}',
  '{foobar}',
  'h8a9sd{foobar}}{asd}}',
  '{foobar',
  'foobar{}',
  '{{foobar}',
  'éêe',
  'àâa',
  '漢字',
  '汉字',
  '호텔',
  '💀',
  '𐀀',
];


describe('byteLength', () => {
  it('should correctly return byte lengths', () => {
    for (let i = 0, len = TEST_STRINGS.length; i < len; i++) {
      const string = TEST_STRINGS[i];
      assert(byteLength(string) === Buffer.byteLength(string, 'utf8'), `'${string}' incorrect byte length`);
    }
  });
});
