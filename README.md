# genjs-cli

`genjs-cli` is a command-line tool that interacts with the [Anthropic API](https://www.anthropic.com/) to generate code templates based on custom prompts. This tool helps developers quickly create React and Node.js applications. With simple commands, you can initialize your project, set an API key, and clear previously generated files.

---

## Features

- **Initialize Projects**: Set your API key and custom prompts to generate code templates.
- **Interact with the Anthropic API**: Use custom prompts to generate Node.js and React code.
- **Persistent API Key**: The API key is saved in the local storage, so you don’t have to input it repeatedly.
- **Interactivity**: During the `init` command, users are prompted for the API key and custom prompt if they haven't been set.
- **File Clearing**: With `clear`, users can remove all generated files with a confirmation prompt.


---

## Installation

To get started with `genjs-cli`, follow these steps:

1. **Install dependencies** using npm:

    ```bash
    npm install genjs-cli -g
    ```
---

## Usage

### `init` Command

Running `npx genjs-cli init` allows the user for setting up the API key and prompt interactively.

![Vaibav-readme](https://github.com/user-attachments/assets/67314c0d-6b04-48d6-9c3f-8d0afdcfb256)


#### Options:

- `-a, --api_key <api_key>`: Set your Anthropic API key (optional, will prompt if not provided).
- `-p, --prompt <prompt...>`: Provide your custom prompt for code generation.

#### Example:

```bash
npx genjs-cli init -a YOUR_API_KEY -p "Generate a React component that fetches data from an API"
```

### clear command:

```bash
npx genjs-cli clear
```

Clears all files in your directory 


