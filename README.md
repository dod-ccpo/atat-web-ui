# atat-web-ui
ATAT Web - Front end

## nvm install

Install: To install, run the following command:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

Set up for use: The script clones the nvm repository to ~/.nvm, and attempts to add the source lines from the snippet below to the correct profile file (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```


## global install

```
 nvm use lts/fermium 
 npm install -g @vue/cli
 npm i -g @vue/cli-service-global
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Updating dependencies:
After a version change or any dependencies change please run also if you're switching branches.: 

```
npm ci 

```

## Setting IDE

### Visual Studio Code
Use the dbaeumer.vscode-eslint (opens new window) extension that Microsoft provides officially.

You have to configure the eslint.validate option of the extension to check .vue files, because the extension targets only *.js or *.jsx files by default.

Example .vscode/settings.json:
```
{
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "vue"
    ]
}
```
If you use the Vetur plugin, set "vetur.validation.template": false to avoid default Vetur template validation. Check out [vetur documentation](https://vuejs.github.io/vetur/guide/linting-error.html#linting) for more info.


### IntelliJ IDEA / JetBrains WebStorm

In the Settings/Preferences dialog (Cmd+,/Ctrl+Alt+S), choose JavaScript under Languages and Frameworks and then choose ESLint under Code Quality Tools. On the ESLint page that opens, select the Enable checkbox.

If your ESLint configuration is updated (manually or from your version control), open it in the editor and choose Apply ESLint Code Style Rules in the context menu.

read more: [JetBrains - ESLint](https://www.jetbrains.com/help/idea/eslint.html)

#


#


## More references:

### Installed CLI Plugins
- [vue-cli](https://cli.vuejs.org/)
- [babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)
- [pwa](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa)
- [router](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router)
- [vuex](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex)
- [eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint)
- [unit-jest](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest)
- [e2e-webdriverio](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-webdriverio)
- [typescript](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript)

### Essential Links

- [Core Docs](https://vuejs.org/)
- [Forum](https://forum.vuejs.org/)
- [Community Chat](https://chat.vuejs.org/)
- [Twitter](https://twitter.com/vuejs)
- [News](https://news.vuejs.org/)

### Ecosystem
- [vue-router](https://router.vuejs.org/)
- [vuex](https://vuex.vuejs.org/)
- [vue-devtools](https://github.com/vuejs/vue-devtools#vue-devtools)
- [vue-loader](https://vue-loader.vuejs.org/)
- [awesome-vue](https://github.com/vuejs/awesome-vue)