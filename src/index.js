#!/usr/bin/env node

import { Command } from 'commander';
import Inquirer from 'inquirer';

const program = new Command();

program
  .command("init")
  .action(() => {
    Inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter your Prompt'
      }
    ]).then(answers => {
      
    });
  });

program.parse(process.argv);
