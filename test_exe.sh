#!/bin/bash
echo "Program was passed $# args (including program name)."
echo "Arg #0 (program name): $0"

# Print each argument
count=1
for arg in "$@"; do
  echo "Arg #$count: $arg"
  count=$((count+1))
done

echo "Program Signature: 12345678"
