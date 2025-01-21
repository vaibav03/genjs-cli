#!/usr/bin/env node

import { Command } from "commander";
import Inquirer from "inquirer";
import axios from "axios";
import { parseXml, createFiles } from "./util.js";

const program = new Command();
program.command("init").action(() => {
  Inquirer.prompt([
    {
      type: "input",
      name: "prompt",
      message: "Enter your Prompt",
    },
  ]).then(async (answers) => {
    const BACKEND_URL = "http://localhost:3000";
    const prompt = answers.prompt;
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: answers.prompt.trim(),
    });

    const { prompts, uiPrompts } = response.data;
    createFiles(uiPrompts[0]);

    if (response.message === "You cant access this") return;

    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      })),
    });

    createFiles(stepsResponse.data.response);
  });
});

program.parse(process.argv);
