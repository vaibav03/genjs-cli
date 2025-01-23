#!/usr/bin/env node

import { Command } from "commander";
import Inquirer from "inquirer";
import axios from "axios";
import { parseXml, createFiles, clearFiles } from "./util.js";
import { template, filesfromAPI } from "./utils/functions.js";
import Anthropic from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./utils/prompts.js";
import { basePrompt as nodeBasePrompt } from "./utils/defaults/node.js";
import { basePrompt as reactBasePrompt } from "./utils/defaults/react.js";

const program = new Command();
program.name("cli-ai").version("1.0.0");

program.command("init").action(() => {
  Inquirer.prompt([
    {
      type: "input",
      name: "api_key",
      message: "Enter your Anthropic API Key"
    },
    {
      type: "input",
      name: "prompt",
      message: "Enter your Prompt",
    },
  ]).then(async (answers) => {

    const prompt = answers.prompt.trim();
    const api_key = answers.api_key;
    const anthropic = new Anthropic({
      apiKey: api_key,
    });

    const response = await template(prompt, anthropic);
    if (response?.message) return console.log(response.message);

    const { prompts, uiPrompts } = response;
    createFiles(uiPrompts[0]);
    const stepsResponse = await filesfromAPI([...prompts, prompt].map((content) => ({
      role: "user",
      content,
    })), anthropic);
    createFiles(stepsResponse.response);
  });
});

let api = null;
program
  .command('configset')
  .option('-k, --api_key <api_key>', 'Set API Key')
  .option('-p, --prompt <prompt...>', 'Set Prompt')
  .action((options) => {
    if (options.api_key || api) {
      api = options.api_key
      console.log("Setting API Key to", options.api_key);
    }
    if (options.prompt) {
      const fullPrompt = options.prompt.join(' ');
      console.log("Setting Prompt to", fullPrompt);
    }
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