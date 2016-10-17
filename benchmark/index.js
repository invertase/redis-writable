'use strict';


var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var toWritable = require('./../');

console.log('\r\n');
require('./print');
console.log('\r\n');


suite
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
    return toWritable('PING', ['moo', 'bar', 'far']);
  })
  .add('4+ args', function () {
    return toWritable('PING', ['moo', 'bar', 'far', 'car', 'rar']);
  })
  .on('cycle', function (e) {
    console.log('' + e.target);
  })
  .run();
