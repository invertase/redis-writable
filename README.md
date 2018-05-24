# redis-writable

[![Coverage Status](https://coveralls.io/repos/github/Salakar/redis-writable/badge.svg?branch=master)](https://coveralls.io/github/Salakar/redis-writable?branch=master)
[![build](https://travis-ci.org/Salakar/redis-writable.svg)](https://travis-ci.org/Salakar/redis-writable)
[![npm version](https://img.shields.io/npm/v/redis-writable.svg)](https://www.npmjs.com/package/redis-writable)
[![License](https://img.shields.io/npm/l/redis-writable.svg)](/LICENSE)
<a href="https://twitter.com/mikediarmid"><img src="https://img.shields.io/twitter/follow/mikediarmid.svg?style=social&label=Follow" alt="Follow on Twitter"></a>

## Usage
`npm i redis-writable`

```javascript
const toWritable = require('redis-writable');

console.log(toWritable('SET', ['foo', 'bar']));

// *3
// $3
// SET
// $3
// foo
// $3
// bar
```


## Benchmarks

```text
Platform info:
Darwin 17.0.0 x64
Node.JS 9.11.1
V8 6.2.414.46-node.23
Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz × 8

byteLength small x 35,985,017 ops/sec ±0.33% (96 runs sampled)
byteLength large x 1,954,952 ops/sec ±0.48% (95 runs sampled)
0 ARGS x 368,105,019 ops/sec ±0.31% (91 runs sampled)
1 arg x 12,872,611 ops/sec ±0.47% (93 runs sampled)
2 args x 10,728,527 ops/sec ±0.53% (93 runs sampled)
3 args x 9,021,635 ops/sec ±0.45% (97 runs sampled)
4+ args x 6,356,287 ops/sec ±0.59% (95 runs sampled)
```
