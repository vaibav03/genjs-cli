#!/usr/bin/env node

import { Command } from 'commander';
// import { samplesteps } from "./samplestep.js";

const program = new Command();
program
  .name("cli-2improv")
  .option('-p <prompt>', 'prompt for generating files')
  .action((options) => {
    if (options.prompt) {
      console.log(options.prompt);
    }
  });

  program.parse(process.argv);
