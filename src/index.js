import fs from "fs";
import path from "path";
import samplesteps from "./samplestep.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const baseDir = path.join(__dirname, "test");

if(!fs.existsSync(baseDir)){
  fs.mkdirSync(baseDir);
}
const createFilesFromSteps = (steps) => {
  steps.forEach((step) => {
    if (step.path) {
      const fullPath = path.join(baseDir, step.path);
      const dir = path.dirname(fullPath);
      const filePath = fullPath;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
      }

      if (step.code) {
        fs.writeFileSync(filePath, step.code);
        console.log(`File created: ${filePath}`);
      } else {
        fs.writeFileSync(filePath, "");
        console.log(`Empty file created: ${filePath}`);
      }
    }
  });
};

createFilesFromSteps(samplesteps);
