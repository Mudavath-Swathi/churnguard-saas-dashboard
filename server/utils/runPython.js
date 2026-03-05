import { spawn } from "child_process";

export const runPython = (scriptPath, input) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [scriptPath]);

    let output = "";
    let error = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      error += data.toString();
    });

    py.on("close", () => {
      if (error) {
        return reject(error);
      }
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject("Invalid JSON from Python");
      }
    });

    py.stdin.write(JSON.stringify(input));
    py.stdin.end();
  });
};