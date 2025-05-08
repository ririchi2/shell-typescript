import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question() {
  rl.question("$ ", (answer) => {

    console.log(`${answer}: command not found\n`);
    question();
  });
}

question();
