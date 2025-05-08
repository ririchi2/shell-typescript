import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
      if (args[0] === "echo") {
        console.log("echo is a shell builtin");
        question();
      } else if (args[0] === "exit") {
        console.log("exit is a shell builtin");
        question();
      } else if (args[0] === "type") {
        console.log("type is a shell builtin");
        question();
      } else {
        console.log(`${args[0]}: not found`);
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
