#!/usr/bin/env node
const chalk = require("chalk");
const path = require("path");
const { readFile } = require("fs/promises");

const msg = require("fs")
  .readFileSync(process.argv[2])
  .toString();

const emojiRegex = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

const startsWithEmoji = message => {
  return emojiRegex.test(message);
};

const getGitmojiChoices = () =>
  readFile(path.join(__dirname, "./gitmojis.json"))
    .then(gitmojiFileData => gitmojiFileData.toString("utf-8"))
    .then(json => {
      return JSON.parse(json).gitmojis;
    })
    .then(gitmojis =>
      gitmojis.map(
        gitmojiItem => `${gitmojiItem.emoji} -- ${gitmojiItem.description}`
      )
    );

const extractEmojiFromString = val => val.match(emojiRegex)[0];

const handleFail = () => {
  console.log(
    chalk.inverse(
      "🔥🔥🔥 Please go back and add an emoji to your commit message"
    )
  );
  process.exit(1);
};

const run = async () => {
  try {
    if (startsWithEmoji(msg)) {
      console.log(chalk.green("✨ Great commit message!"));
      process.exit(0);
    }

    process.on("SIGINT", handleFail);

    process.on("exit", () => {
      handleFail();
    });

    console.log(chalk.blue("😎 The best commit messages start with an emoji"));

    const chosenEmoji = await require("inquirer")
      .prompt([
        {
          type: "confirm",
          name: "wouldLikeHelp",
          message: "Would you like me to help you choose one? ☺️",
          default: true
        },
        {
          type: "list",
          name: "emoji",
          pageSize: 20,
          message: "Choose a relevant emoji",
          choices: getGitmojiChoices,
          filter: extractEmojiFromString,
          when: function(answers) {
            return answers.wouldLikeHelp === true;
          }
        }
      ])
      .then(answers => {
        if (answers.wouldLikeHelp === false || !answers.emoji) {
          return process.exit(1);
        }
        return answers.emoji;
      });

    if (chosenEmoji) {
      require("fs").writeFileSync(process.argv[2], `${chosenEmoji} ${msg}`);
      process.removeAllListeners("exit");
      process.exit(0);
    }
  } catch (err) {
    console.log(
      chalk.yellow(
        "🙈  Something went wrong while trying to add an emoji to your commit! It would be great if you could let me know.",
        chalk.red(err.message),
        chalk.red(err.stack)
      )
    );
  }
};

run();
