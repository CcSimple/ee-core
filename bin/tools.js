#!/usr/bin/env node

const replaceDist = require('../tools/replaceDist');
const encrypt = require('../tools/encrypt');
const iconGen = require('../tools/iconGen');

// argv
const args = process.argv;
// console.log('[ee-core] args:', args);
const cmd = args[2];
console.log('[ee-core] [bin/tools] cmd:', cmd);

if (cmd == 'rd') {
  replaceDist.run();
}

if (cmd == 'encrypt') {
  encrypt.run();
}

if (cmd == 'clean') {
  encrypt.clean();
}

if (cmd == 'icon') {
  iconGen.run();
}
