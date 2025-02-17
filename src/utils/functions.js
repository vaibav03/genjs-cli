import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import Anthropic from "@anthropic-ai/sdk";
import { createFiles } from "../util.js";
import { createSpinner } from "nanospinner";

export async function template(prompt, anthropic) {
  try {
    const response = await anthropic.messages.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      system:
        "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    });

    const answer = response.content[0].text;
    // console.log("Answer from template",answer);
    if (answer == "react") {
      return {
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}. IMPORTANT: BUT IN CASE THE PROMPT, ASKS FOR A DIFFERENT TECH STACK FEEL FREE TO OVERWRITE FILES  \n\nHere is a list of files that exist on the file system but are not being shown to you: Feel free to overwrite any files if necessary.\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      };
    }

    if (answer === "node") {
      return {
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you: Feel free to overwrite any files if necessary.\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      };
    }
    return {
      message: "The template only supports 'react' or 'node' for now!!",
    };
  } catch (e) {
    return { message: e };
  }
}

export async function filesfromAPI(messages, anthropic) {
  try {
    const response = await anthropic.messages.create({
      messages: messages,
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      system: getSystemPrompt(),
    });

    // console.log(response);
    return {
      response: response.content[0]?.text,
    };
  } catch (e) {
    const message = e?.error?.error?.message;
    return { message: message };
  }
}
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./api_key");
export { localStorage };
export async function initCommand(answers) {
  if (answers.api_key && answers.prompt) {
    const prompt = answers.prompt.trim();
    const api_key = answers.api_key;
    const anthropic = new Anthropic({
      apiKey: api_key,
    });

    const response = await template(prompt, anthropic);
    if (response?.message) return console.log(response.message);
    const { prompts, uiPrompts } = response;
    createFiles(uiPrompts[0]);
    const spinner = createSpinner("Fetching Files from Anthropic API").start();
    if (!localStorage.getItem["api_key"])
      localStorage.setItem("api_key", answers.api_key);
    const stepsResponse = await filesfromAPI(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      })),
      anthropic,
    );
    spinner.success();
    const spinner1 = createSpinner("Creating Files in your Directory").start();
    createFiles(stepsResponse.response);
    spinner1.success();
  }
}
