const fs = require("fs");

const msg = fs.readFileSync(process.argv[2]).toString();

const emojiRegex = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

if (emojiRegex.test(msg)) {
  console.log("\x1b[33m%s\x1b[0m", "✨ Great commit message!");
} else {
  console.log(
    "\x1b[35m",
    "🔥 🔥 🔥 Please add an emoji to your commit message and try again. \n For inspiration check https://gitmoji.carloscuesta.me/"
  );
  process.exit(1);
}
