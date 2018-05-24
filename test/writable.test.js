const assert = require('assert');
const toWritable = require('../');

const TEST_ARGS = [
  ['*1\r\n$4\r\nPING\r\n', ['PING']],
  ['*2\r\n$4\r\nINCR\r\n$3\r\nmoo\r\n', ['INCR', ['moo']]],
  ['*3\r\n$4\r\nINCR\r\n$3\r\nmoo\r\n$1\r\n1\r\n', ['INCR', ['moo', 1]]],
  ['*3\r\n$4\r\nINCR\r\n$3\r\nmoo\r\n$1\r\n6\r\n', ['INCR', ['moo', 6]]],
  ['*4\r\n$4\r\nPING\r\n$3\r\nmoo\r\n$1\r\n0\r\n$1\r\n1\r\n', ['PING', ['moo', 0, 1]]],
  ['*5\r\n$4\r\nPING\r\n$3\r\nmoo\r\n$1\r\n0\r\n$1\r\n1\r\n$4\r\nnull\r\n', ['PING', ['moo', 0, 1, null]]],
  ['*9\r\n$4\r\nPING\r\n$1\r\n0\r\n$1\r\n1\r\n$9\r\nundefined\r\n$10\r\n[Function]\r\n$15\r\n[object Object]\r\n$15\r\n[object Object]\r\n$8\r\n[Symbol]\r\n$3\r\nfoo\r\n', ['PING', [0, 1, undefined, () => {}, {}, [], Symbol(), 'foo']]],
];


describe('toWritable', () => {
  it('should correctly return writable string values', () => {
    for (let i = 0, len = TEST_ARGS.length; i < len; i++) {
      const [output, args] = TEST_ARGS[i];
      assert(toWritable(...args) === output, `TEST_ARGS[${i}] incorrect writable string returned`);
    }
  });
});
