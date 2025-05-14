import { createInterface } from "readline";
import * as fs from "fs";
import { spawn } from 'child_process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathDir = process.env.PATH ? process.env.PATH.split(":") : [];
const homeDir = process.env.HOME || "";

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

function parseCommand(input: string): string[] {
  const result: string[] = [];
  debugger;
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === " " && !inQuotes) {
      if (current.length > 0) {
        result.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current.length > 0) {
    result.push(current);
  }
  if (inQuotes) {
    console.error("Error: Unmatched quotes in command");
    return [];
  }
  return result;
}

function question() {
  rl.question("$ ", (answer) => {
    let answerArray = parseCommand(answer);
    let command = answerArray[0];
    let args = answerArray.slice(1);
    let builtinCommands = ["echo", "exit", "type", "pwd"];

    // Leemos argumentos builtin
    if (command === "exit" && args[0] === "0") {
      rl.close();
      return;
    }
    else if (command === "echo") {
      console.log(args.join(" "));
      question();
    }
    else if (command === "type") {
      if (args.length === 0) {
        console.log("type: missing argument");
        question();
        return; // Añadir return para evitar continuar
      }
      if (args.length > 1) {
        console.log("type: too many arguments");
        question();
        return; // Añadir return para evitar continuar
      }
      if (builtinCommands.includes(args[0])) {
        console.log(`${args[0]} is a shell builtin`);
        question();
      } else {
        const commandPath = findInPath(args[0]);
        if (commandPath) {
          console.log(`${args[0]} is ${commandPath}`);
          question();
        } else {
          console.log(`${args[0]}: not found`);
          question();
        }
      }
    }
    else if (command === "pwd") {
      // Obtener el directorio de trabajo actual
      const currentDir = process.cwd();
      console.log(currentDir);
      question();
    }
    else if (command === "cd") {
      if (args.length === 0) {
        console.log("cd: missing argument");
        question();
        return; // Añadir return para evitar continuar
      }
      if (args.length > 1) {
        console.log("cd: too many arguments");
        question();
        return; // Añadir return para evitar continuar
      }
      if (args[0] === "~") {
        const newDir = homeDir;
        try {
          process.chdir(newDir);
        }
        catch (err) {
          console.log(`cd: ${newDir}: No such file or directory`);
        }
        question();
      } else {
        const newDir = args[0];
        try {
          process.chdir(newDir);
        }
        catch (err) {
          console.log(`cd: ${newDir}: No such file or directory`);
        }
        question();
      }
    }
    else {
      // Comando externo
      const commandPath = findInPath(command);
      if (commandPath) {
        // Ejecutar el comando externo con sus argumentos
        const childProcess = spawn(command, args);

        childProcess.stdout.on("data", (data) => {
          process.stdout.write(data);
        });

        childProcess.stderr.on("data", (data) => {
          process.stderr.write(data);
        });

        childProcess.on("close", (code) => {
          question(); // Mostrar el prompt solo después de que termine el comando
        });
      } else {
        console.log(`${command}: command not found`);
        question();
      }
    }
  });
}

question();
