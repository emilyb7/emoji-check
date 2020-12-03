## What's this for?

This package helps enforce some basic commit-message hygiene across a codebase by prompting developers to start their commit messages with an emoji.



## How to use?

✨ Install as a dev dependency:

```sh
npm install emoji-commit-message-validator --save --dev
```

Or with yarn:

```sh
yarn add husky -D
```

🐶 You'll also need to install Husky to run commit message hooks:


🔧 Configure husky

You can add the following to your package.json


```json
{
  "husky": {
    "hooks": {
      "commit-msg": "emoji-check $HUSKY_GIT_PARAMS"
    }
  }
}
```

Or create a `.huskyrc` file with the following content

```rc
{
  "hooks": {
    "commit-msg": "emoji-check $HUSKY_GIT_PARAMS"
  }
}
```
