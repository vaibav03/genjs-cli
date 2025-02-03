import { exec } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";
import { createSpinner } from "nanospinner";
const StepType = {
  CreateFolder: "CreateFolder",
  CreateFile: "CreateFile",
  RunScript: "RunScript",
};

export function parseXml(response) {
  const xmlMatch = response.match(
    /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/,
  );

  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps = [];
  let stepId = 1;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : "Project Files";

  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: "",
    type: StepType.CreateFolder,
    status: "pending",
  });

  const actionRegex =
    /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === "file") {
      // File creation step
      steps.push({
        id: stepId++,
        title: `Create ${filePath || "file"}`,
        description: "",
        type: StepType.CreateFile,
        status: "pending",
        code: content.trim(),
        path: filePath,
      });
    } else if (type === "shell") {
      steps.push({
        id: stepId++,
        title: "Run command",
        description: "",
        type: StepType.RunScript,
        status: "pending",
        code: content.trim(),
      });
    }
  }

  return steps;
}


export const createFiles = (response) => {
  const steps = parseXml(response);
  const __dirname = (new URL(process.cwd()).pathname)
  const baseDir = path.join(__dirname, "test");

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  steps.forEach((step) => {
    if (step.path) {
      const fullPath = path.join(baseDir, step.path);
      const dir = path.dirname(fullPath);
      const filePath = fullPath;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (step.code) {
        fs.writeFileSync(filePath, step.code);
      } else {
        fs.writeFileSync(filePath, "");
      }
    } else if (step.type === "RunScript") {
      try {
        const command = step.code;
        console.log(`Run command: ${command}`);
      } catch (error) {
        console.error(`Failed to execute script: ${error.message}`);
      }
    }
  });
};


export const clearFiles = () => {
  const dir = process.cwd();
  const spinner = createSpinner("Clearing files...").start();
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
    spinner.success({ text: "Files cleared successfully" });
  } catch (error) {
    if (error.code === "EBUSY") {
      console.error(
        `The directory or file is busy or locked: ${error.path}. Ensure no other process is using it and try again.`
      );
    } else {
      console.error(`Error deleting files: ${error.message}`);
    }
  }
};
