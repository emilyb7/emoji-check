#!/usr/bin/env node
const { exec } = require("child_process");

exec(
  "yarn husky add .husky/commit-msg 'exec < /dev/tty; yarn emoji-check-interactive $1'"
);
