import { createInterface } from "readline";
import * as fs from "fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathDir = process.env.PATH ? process.env.PATH.split(":") : [];

function isExecutable(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function findInPath(command: string): string | null {
  for (const dir of pathDir) {
    const filePath = `${dir}/${command}`;
    if (isExecutable(filePath)) {
      return filePath;
    }
  }
  return null;
}

function question() {
  rl.question("$ ", (answer) => {
    let answerArray = answer.split(" ");
    let command = answerArray[0];
    let args = answerArray.slice(1);
    let builtinCommands = ["echo", "exit", "type"];
    if (command === "exit" && args[0] === "0") {
      rl.close();
      return;
    }
    else if (command === "echo") {
      // console.log("args", args);
      console.log(args.join(" "));
      question();
    }
    else if (command === "type") {
      if (args.length === 0) {
        console.log("type: missing argument");
        question();
      }
      if (args.length > 1) {
        console.log("type: too many arguments");
        question();
      }
      if (builtinCommands.includes(args[0])) {
        console.log(`${args[0]} is a shell builtin`);
        question();
      } else {
        const commandPath = findInPath(args[0]);
        if (commandPath) {
          console.log(`${args[0]} is ${commandPath}`);
        } else {
          console.log(`${args[0]}: not found`);
        }
        question();
      }
    }
    else {
      console.log(`${answer}: command not found`);
    }
    question();
  });
}

question();
