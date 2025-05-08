import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question() {
  rl.question("$ ", (answer) => {
    if (answer === "exit 0") {
      rl.close();
      return;
    }
    console.log(`${answer}: command not found`);
    question();
  });
}

question();
