const msg = require("fs")
  .readFileSync(process.argv[2])
  .toString();

const emojiRegex = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

const startsWithEmoji = message => {
  return emojiRegex.test(message);
};

const gitmojis = require("./gitmojis.json").gitmojis.map(
  gitmoji => `${gitmoji.emoji} -- ${gitmoji.description}`
);

let complete = false;

if (startsWithEmoji(msg)) {
  complete = true;
  console.log("✨ Great commit message!");
  process.exit(0);
}

console.log("😎 The best commit messages start with an emoji");

require("inquirer")
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
      message: "Choose a relevant emoji",
      choices: gitmojis,
      filter: function(val) {
        return val.match(emojiRegex)[0];
      },
      when: function(answers) {
        return answers.wouldLikeHelp === true;
      }
    }
  ])
  .then(answers => {
    if (answers.wouldLikeHelp === false || !answers.emoji) {
      console.log("🔥 Please go back and add an emoji to your commit message");
      return process.exit(1);
    }
    return answers.emoji;
  })
  .then(emoji =>
    require("fs").writeFileSync(process.argv[2], `${emoji} ${msg}`)
  )
  .then(() => (complete = true));

process.on("exit", () => {
  if (!complete) {
    console.log("🔥 Please go back and add an emoji to your commit message");
    process.exit(1);
  }
});
