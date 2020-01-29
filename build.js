const path = require('path');
const shell = require('shelljs');

const ROOT_PATH = __dirname;
const JS_STATIC_PATH = path.join(ROOT_PATH, 'static/js');

const execWebpack = (path, isWatch) => {
  let command = 'cd seohyeonee-front && webpack --config webpack.build.config.js';
  command += isWatch ? ` --watch --env.path=${path}` : ` --env.path=${path}`;
  console.log(`Run command: ${command}`);
  shell.exec(command);
};

console.log('Build front code...\n');

const argv = process.argv.slice(2);
const isWatch = argv.includes('--watch');
execWebpack(JS_STATIC_PATH, isWatch);
