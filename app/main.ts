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
    if (command === "exit" && args[0] === "0") {
      rl.close();
      return;
    }
    if (command === "echo") {
      console.log(args.join(" "));
      question();
    }
    question();
  });
}

question();
