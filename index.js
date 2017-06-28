'use strict';

const cmdCache = {};
const cmdCachePartial = {};

const newLine = '\r\n';
const zeroArg = '$1\r\n0\r\n';
const oneArg = '$1\r\n1\r\n';
const nullArg = '$4\r\nnull\r\n';
const symbolArg = '$8\r\n[Symbol]\r\n';
const undefArg = '$9\r\nundefined\r\n';
const functionArg = '$10\r\n[Function]\r\n';
const objectArg = '$15\r\n[object Object]\r\n';

/**
 * Faster for short strings less than 1024 in length.
 * Larger strings use Buffer.byteLength()
 * @param str
 * @returns {*}
 */
function byteLength(str) {
  if (str.length > 1023) return Buffer.byteLength(str, 'utf8');

  var code;
  var s = str.length;
  var i = s - 1;

  while (i--) {
    code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xDC00 && code <= 0xDFFF) i--; // trail surrogate
  }

  return s;
}

/**
 * Commands with no args - cached.
 * @param cmd
 * @returns {*}
 */
function cmdWritable(cmd) {
  return cmdCache[cmd] || (cmdCache[cmd] = '*1\r\n$' + cmd.length + '\r\n' + cmd + '\r\n');
}

/**
 * Caches a cmd partial (without the *argLength) - cached.
 * @param cmd
 * @returns {*}
 */
function cmdPartial(cmd) {
  return cmdCachePartial[cmd] || (cmdCachePartial[cmd] = '\r\n$' + cmd.length + newLine + cmd + newLine);
}


/**
 * Convert an arg based on it's primitive type.
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
      else if (arg == 1) return oneArg;
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
    default:
      return '$' + byteLength('' + arg) + newLine + arg + newLine;
  }
}

/**
 * Convert a CMD and args to a redis writable
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
      const l = args.length;
      var writable = '*' + (l + 1) + cmdPartial(cmd);
      for (var i = 0; i < l; i++) {
        writable = writable + argWritable(args[i]);
      }
      return writable;
  }
}

module.exports = toWritable;
