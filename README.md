# genreact-node

`genreact-node` is a command-line tool that interacts with the [Anthropic API](https://www.anthropic.com/) to generate code templates based on custom prompts. This tool helps developers quickly create React and Node.js applications. With simple commands, you can initialize your project, set an API key, and clear previously generated files.

---

## Features

- **Initialize Projects**: Set your API key and custom prompts to generate code templates.
- **Clear Generated Files**: Easily remove any generated files with a simple command.
- **Interact with the Anthropic API**: Use custom prompts to generate Node.js and React code.
- **Modular and Extensible**: Easily extendable for additional templates and functionality.

---

## Installation

To get started with `genreact-node`, follow these steps:

1. **Clone the repository** or download the latest release.
2. **Install dependencies** using npm:

    ```bash
    npm install
    ```

3. **Link the command globally** to make it available in your terminal:

    ```bash
    npm link
    ```

After that, you can use the `genreact-node` command in your terminal.

---

## Usage

### `init` Command

The `init` command initializes your project by setting the Anthropic API key and a custom prompt for code generation.

#### Options:

- `-a, --api_key <api_key>`: Set your Anthropic API key (optional, will prompt if not provided).
- `-p, --prompt <prompt...>`: Provide your custom prompt for code generation.

#### Example:

```bash
genreact-node init -a YOUR_API_KEY -p "Generate a React component that fetches data from an API"
