#!/usr/bin/env node

import { Command } from "commander";
import Inquirer from "inquirer";
import axios from "axios";
import { parseXml, createFiles, clearFiles } from "./util.js";
import { template, filesfromAPI, initCommand } from "./utils/functions.js";
import { BASE_PROMPT, getSystemPrompt } from "./utils/prompts.js";
import { basePrompt as nodeBasePrompt } from "./utils/defaults/node.js";
import { basePrompt as reactBasePrompt } from "./utils/defaults/react.js";
import { localStorage } from "./utils/functions.js";

const program = new Command();
program.name("cli-ai").version("1.0.0");

program.command("init").option('-a, --api_key <api_key>', 'Set API Key').option('-p, --prompt <prompt...>', 'Set Prompt').
  action((actions) => {
    if ((actions.api_key || localStorage.getItem("api_key")) && actions.prompt) {
      if (localStorage.getItem("api_key"))
        actions.api_key = localStorage.getItem("api_key");

      actions.prompt = actions.prompt.join(' ');
      return initCommand(actions);
    }

    Inquirer.prompt([
      {
        type: "input",
        name: "api_key",
        message: "Enter your Anthropic API Key (if aleady entered then press enter)",
        default: localStorage.getItem("api_key")
      },
      {
        type: "input",
        name: "prompt",
        message: "Enter your Prompt",
      },
    ]).then(async (answers) => {
      await initCommand(answers);
      return;
    });
  });



program.command('clear').action(() => {
  Inquirer.prompt([
    {
      type: "confirm",
      name: "delete",
      message: "Do you want to delete the created files?"
    }
  ]).then((answers) => {
    if (answers.delete) {
      clearFiles();
    }
  });
})

program.parse(process.argv);