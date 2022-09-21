#!/usr/bin/env node

// import yargs from 'yargs';
const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');
// import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' })
  .argv;