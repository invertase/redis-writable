const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const toWritable = require('./../');

console.log('\r\n');
require('./print');

const largeStr = new Array(4096 + 1).join('-');

suite
  .add('byteLength small', function () {
    toWritable.byteLength('PING');
  })
  // .add('byteLength small - native', function () {
  //   Buffer.byteLength('PING', 'utf8')
  // })
  .add('byteLength large', function () {
    toWritable.byteLength(largeStr);
  })
  // .add('byteLength large - native', function () {
  //   Buffer.byteLength(largeStr, 'utf8')
  // })

  .add('0 ARGS', function () {
    return toWritable('PING');
  })
  .add('1 arg', function () {
    return toWritable('INCR', ['moo']);
  })
  .add('2 args', function () {
    return toWritable('INCR', ['moo', 1]);
  })
  .add('3 args', function () {
    return toWritable('PING', ['moo', 0, 1]);
  })
  .add('4+ args', function () {
    return toWritable('PING', [0, 1, undefined, () => {}, {}, 'foo']);
  })
  .on('cycle', function (e) {
    console.log('' + e.target);
  })
  .run();
