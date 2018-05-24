'use strict';

const cmdCache = {};
const cmdCachePartial = {};

const newLine = '\r\n';
const oneArg = '$1\r\n1\r\n';
const zeroArg = '$1\r\n0\r\n';
const nullArg = '$4\r\nnull\r\n';
const symbolArg = '$8\r\n[Symbol]\r\n';
const undefArg = '$9\r\nundefined\r\n';
const functionArg = '$10\r\n[Function]\r\n';
const objectArg = '$15\r\n[object Object]\r\n';

/**
 * Faster for short strings less than 1024 in length.
 * Larger strings use Buffer.byteLength()
 * Note: Purely for node 8. 9 + 10 are generally the same to use this or Buffer.byteLength
 * @param str
 * @returns {*}
 */
function byteLength(str) {
  if (str.length > 512) return Buffer.byteLength(str, 'utf8');

  var char;
  var i = 0;
  var byteLength = 0;
  var len = str.length;

  for (; i < len; i++) {
    char = str.charCodeAt(i);
    if (char < 128) {
      byteLength++;
    } else if (char < 2048) {
      byteLength += 2;
    } else if (
      (char & 0xfc00) === 0xd800 &&
      i + 1 < len &&
      (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00
    ) {
      ++i;
      byteLength += 4;
    } else {
      byteLength += 3;
    }
  }

  return byteLength;
}

/**
 * Commands with no args - cached.
 *
 * @param cmd
 * @returns {*}
 */
function cmdWritable(cmd) {
  return cmdCache[cmd] || (cmdCache[cmd] = '*1\r\n$' + cmd.length + '\r\n' + cmd + '\r\n');
}

/**
 * Caches a cmd partial (without the *argLength) - cached.
 *
 * @param cmd
 * @returns {*}
 */
function cmdPartial(cmd) {
  return cmdCachePartial[cmd] || (cmdCachePartial[cmd] = '\r\n$' + cmd.length + newLine + cmd + newLine);
}


/**
 * Convert an arg based on it's primitive type.
 *
 * @param arg
 * @returns {string}
 */
function argWritable(arg) {
  switch (typeof arg) {
    case 'string':
    case 'boolean':
      return '$' + byteLength('' + arg) + newLine + arg + newLine;
    case 'number':
      if (arg == 0) return zeroArg;
      if (arg == 1) return oneArg;
      return '$' + byteLength('' + arg) + newLine + arg + newLine;
    case 'undefined':
      return undefArg;
    case 'object':
      if (arg == null) return nullArg;
      else return objectArg;
    case 'function':
      return functionArg;
    case 'symbol':
      return symbolArg;
  }
}

/**
 * Convert a CMD and args to a redis writable string
 * @param cmd
 * @param args
 * @returns {string}
 */
function toWritable(cmd, args) {
  if (!args || !args.length) return cmdWritable(cmd);
  switch (args.length) {
    case 1:
      return '*2' + cmdPartial(cmd) + argWritable(args[0]);
    case 2:
      return '*3' + cmdPartial(cmd) + argWritable(args[0]) + argWritable(args[1]);
    case 3:
      return '*4' + cmdPartial(cmd) + argWritable(args[0]) + argWritable(args[1]) + argWritable(args[2]);
    default:
      var i = 0;
      var l = args.length;
      var writable = '*' + (l + 1) + cmdPartial(cmd);
      for (; i < l; i++) {
        writable = writable + argWritable(args[i]);
      }
      return writable;
  }
}

module.exports = toWritable;
module.exports.byteLength = byteLength;
