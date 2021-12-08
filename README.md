<!-- logo (start) -->
<p align="center">
  <img src=".github/img/roswell.logo.coords.svg" width="250px">
</p>
<!-- logo (end) -->

<!-- badges (start) -->
<p align="center"></p>
<!-- badges (end) -->

<!-- title / description (start) -->
<h2 align="center">Roswell Shopify Vue BaseTheme</h2>

A template starter theme for Roswell Vue-component-module themes.

<!-- toc (start) -->
## Table of contents

- [Demo Store](#demo-store)
- [System requirements](#system-requirements)
- [Installing](#installing)
- [Getting started](#getting-started)
- [Conventional Commits](#conventional-commits)
- [Linting](#linting)
- [Storybook](#storybook)
- [Deploying](#deploying)
  - [CI/CD](#cicd)
- [Project structure](#project-structure)
- [Tasks](#tasks)
- [Development environment concepts](#development-environment-concepts)
  - [CLI](#cli)
  - [Configs](#configs)
  - [Shopify & environment initialization](#shopify--environment-initialization)
  - [Shopify + webpack](#shopify--webpack)
  - [Shopify remote auto-reloading](#shopify-remote-auto-reloading)
- [Limitations](#limitations)
- [Credits](#credits)
<!-- toc (end) -->

<!-- demo store (start) -->
## Demo Store
- Link to the [demo store](https://roswelldev.myshopify.com/)

<!-- demo store (end) -->

<!-- system requirements (start) -->
## System requirements

- Node.js >= `12.0.0`
- yarn
<!-- system requirements (end) -->

<!-- installing (start) -->
## Installing
### yarn
```sh
$ yarn install
```

<!-- installing (end) -->

<!-- getting started (start) -->
## Getting started

### Set up your config and initialize a new dev theme:

1. Copy and rename the Shopify sample config file:

```sh
$ cp .config/shopify/shopify.sample.yml .config/shopify/shopify.dev.yml # or copy and rename manually
```

2. Revise your `shopify.dev.yml` file making sure you have the correct values for...

  * `store`
  * `password`
  * `theme_id` for the correct release/_candidate theme

3. Initialize theme on Shopify store with credentials from the first step. Either for **dev** or **live** environment. `shopify:init` will create a new theme by duplicating the theme in your config's `theme_id`. You will still need to copy the password and store from your into the command below. 

```sh
$ yarn shopify:init --password [api-password] --store [store.myshopify.com] --env dev --name "RS DEV: [your theme name]"
```

### ***OR***, Set up your config and connect to an existing theme:

1. Run the following command to list all themes:

```sh
$ yarn shopify:themes --password [api-password] --store [store.myshopify.com]
```

2. Copy and rename the Shopify sample config file:

```sh
$ cp .config/shopify/shopify.sample.yml .config/shopify/shopify.dev.yml # or copy and rename manually
```

3. Revise your `shopify.dev.yml` file making sure you have the correct values for...

  * `store`
  * `password`
  * `theme_id` for the theme you want from the list in step 1 above. 

### Start developing

```sh
$ yarn start
$ yarn open:dev # open/preview theme in default browser
```
<!-- getting started (end) -->

<!-- commit messages (start) -->

## Conventional Commits

- Let's categorize our commit messages using the spec from [Conventional Commits](https://www.conventionalcommits.org/)

```
build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
docs: Documentation only changes
feat: A new feature
fix: A bug fix
perf: A code change that improves performance
refactor: A code change that neither fixes a bug nor adds a feature
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
test: Adding missing tests or correcting existing tests
```

<!-- commit messages (end) -->

<!-- linting (start) -->
## Linting

***VS Code***

1. Open your project's workspace settings (shift + cmd + p and type "workspace settings")
2. Use the filter and type in "eslint" and click on the extension's settings
3. Navigate to Eslint: Options and click on "edit in settings.json"
4. Set the config to point to the .eslintrc.js file in the project, e.g.:
```
{
  "eslint.options": { 
    "configFile": "/Users/hughlim/WorkSpace/Shopify/VueJs/BaseThemeShopifyVue/.config/.eslintrc.js"
  }
}
```
5. After restarting your workspace, you can now (shift + cmd + p and type "eslint" and select ESLint: Fix all auto-fixable Problems)

6. You can also automatically format on save!
```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript"]
}
```

***CLI***

```sh
yarn lint
```
```sh
yarn lint:css
```
```sh
yarn lint:js
```

add `--fix` to automatically fix!
<!-- linting (start) -->

<!-- storybook (start) -->
## Storybook

***Storybook currently is not compatible with Webpack 5.  I'll update this section once the next release contains the fix***
<!-- storybook (start) -->

<!-- deploying (start) -->
## Deploying
> first, make sure the configuration for the `live` environment is initialized.

```sh
$ yarn build # bundle js, css and other assets like images/fonts with webpack
$ yarn deploy:live # deploy shopify/ directory
```

> There is a safety mechanism in place, which won't allow you to deploy to an already published theme on the **live** store. If you want to deploy regardless use the `--allow-live` flag.

```sh
$ yarn deploy:live --allow-live
```

### CI/CD

#### GitHub actions

1. Add the following four secrets to your repo in `settings` → `secrets`:

```sh
SHOPIFY_API_PASSWORD # api-password
SHOPIFY_STORE_URL # store.myshopify.com
SHOPIFY_ENV # dev or live
SHOPIFY_THEME_ID # theme-id (without quotation marks) - find the id either in shopify.[env].config.yml or with shopify:themes task
```

2. Copy and paste into a GitHub action (adjust contents if necessary):

```yml
# CI/CD integration for GitHub actions
name: CI/CD

on:
  push:
    branches: [ release/_candidate ]
  workflow_dispatch: # allows to manually run from GitHub actions panel

jobs:
  build-and-deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 14.x ]

    steps:
      - name: Checkout master branch
        uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v2.1.4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies and build dist files
        run: |
          npm install -g yarn # Extra Step
          yarn install
          yarn build

      # make sure the theme is already initialized on the Shopify store
      - name: Deploy to Shopify
        run: |
          yarn settings:${{ secrets.SHOPIFY_ENV }}
          yarn deploy --password=${{ secrets.SHOPIFY_PASSWORD }} --store=${{ secrets.SHOPIFY_STORE_URL }} --env=${{ secrets.SHOPIFY_ENV_LABEL_RELEASECANDIDATE }} --themeid=${{ secrets.SHOPIFY_ENV_THEMEID_RELEASECANDIDATE }} --dir=${{ secrets.THEME_PATH }}
```
<!-- deploying (end) -->

<!-- project structure (start) -->
## Project structure

```text
base-theme/                    📁 root
├── .config/                   📁 development environment files and configs
│   ├── shopify/               📁 Shopify credential-configs
│   │   ├── .shopifyignore     📄 files and directories that won't be uploaded to Shopify
│   │   └── ...
│   ├── webpack/               📁 webpack configs
│   │   ├── webpack.common.js  📄 webpack shared config used in development and production
│   │   ├── webpack.dev.js     📄 webpack development config
│   │   └── webpack.prod.js    📄 webpack production config
│   ├── .browserslistrc        📄 Browserslist config
│   ├── .eslintrc.js           📄 ESLint config
│   ├── .stylelintrc.js        📄 stylelint config
│   └── postcss.config.js      📄 PostCSS config
├── .github/                   📁 files related to GitHub and images for READMEs
├── .stories/                  📁 Storybook configs
├── shopify/                   📁 default Shopify theme structure
│   ├── assets/                📁 files outputted by webpack will be placed here
│   └── ...
├── src/                       📁 source files processed by webpack
│   ├── styles/                    📁 css directory
│   │   └── main.scss           📄 main stylesheet
│   ├── scripts/                   📁 Vue, Vuex files and directories
│   │   └── components/               📁 Vue components
│   │   │   └── render/                  📁 Vue (SFC) Single File Components
│   │   │   └── renderless/              📁 Vue [renderless components](https://css-tricks.com/building-renderless-vue-components/)
│   │   └── directives/               📁 Vue directives (https://vuejs.org/v2/guide/custom-directive.html) a directive is some special token in the markup that tells the library to do something to a DOM element
│   │   └── filters/                  📁 Vue filters (https://vuejs.org/v2/guide/filters.html) custom formatting filter using the "pipe" in {{}} and v-bind
│   │   └── helpers/                  📁 Custom helper functions
│   │   └── jsons/                    📁 static json files (currently used for the recommended product engine)
│   │   └── mixins/                   📁 Vue mixins (https://vuejs.org/v2/guide/mixins.html) a flexible way to distribute reusable functionalities for Vue components
│   │   └── store/                    📁 Vuex store modules - a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion
│   ├── stories/                   📁 Storybook stories
│   ├── main.js                📄 webpack's main entry point
│   └── tailwind.config.js     📄 Tailwind CSS config
├── .gitignore                 📄 files and directories ignored by git
├── package.json               📄 dependencies and tasks
└── ...
```
<!-- project structure (end) -->

<!-- tasks (start) -->
## Tasks

| Task | Description |
| - | - |
| start | run `dev`, `reloadr` and `shopify:watch` tasks simultaneously in parallel |
| dev | bundle and watch for changes in `src/` files with webpack |
| build | create minified production files for Shopify in `shopify/assets/` directory |
| reloadr | run an HTTP server and WebSocket server for remote auto-reloading |
| lint | run `lint:js` and `lint:css` tasks in sequence |
| lint:js | lint `.js` and `.vue` files inside the `src/` directory |
| lint:css | lint the `<style></style>` section of `.vue` files, `.css`, `.sass` and `.scss` files inside the `src/` directory |
| shopify:init | initialize a theme on remote Shopify store and create a Shopify config file for the specified environment (Run in the root directory of your project) |
| shopify:watch | watch for changes in the `shopify/` directory and upload to the dev store |
| shopify:themes | list all themes with IDs from the provided store. Takes two arguments `--password` and `--store` |
| deploy:dev | upload the `shopify/` directory to the dev store |
| deploy:live | upload the `shopify/` directory to the live store |
| settings:dev | download `settings_data.json` from the dev store |
| settings:live | download `settings_data.json` from the live store |
| open:dev | open/preview theme on the dev store |
| open:live | open/preview theme on the live store |
<!-- tasks (end) -->

<!-- development environment concepts (start) -->
## Development environment concepts

### CLI
This theme uses the [Shopify Theme Lab CLI](https://github.com/uicrooks/shopify-theme-lab-cli) for some tasks. You can also use the CLI independantly from included tasks.

### Configs
Inside `.configs/` are multiple pre-configured config files. You should be able to work from start to finish, without ever going into this directory. But if you feel the need to adjust some configs to your liking, go for it!

### Shopify & environment initialization
By running `shopify:init` and entering credentials, the task initializes a new theme from `shopify/` directory to the provided Shopify store. It also saves a configuration file for the specified environment inside `.config/shopify/` directory. This file will be ignored by git and shouldn't be tracked for security reasons. All tasks regarding Shopify will use the credentials from the saved configuration file.

### Shopify + webpack
- All webpack configs are inside `.config/webpack/` directory
- [main.js](src/main.js) is webpack's main entry point
- All Vue related files are auto-loaded by webpack with [require.context](https://webpack.js.org/guides/dependency-management/#requirecontext) - Vue components, Vuex modules, as well as mixins, directives and filters with `global` in their filename. Everything is defined in `src/main.js`
- Vue components can be either used as regular single-file-components or as [renderless components](https://css-tricks.com/building-renderless-vue-components) without `<template></template>` tags (You can use Liquid templating while hooking in Vue functionality).
- The webpack bundle and all other assets are outputted to `shopify/assets/` directory. This directory is cleaned on every build. If you want to keep certain files like favicons add `static` to their filenames: `myfile.static.png`

### Shopify remote auto-reloading
While `yarn start` task is running: The `shopify/` directory is being watched for changes and all changed files are uploaded to the Shopify remote server. After the upload is finished, a request is sent to a `localhost:port` address (specified in `package.json`) and the [shopify-reloadr](https://github.com/uicrooks/shopify-reloadr) package reloads all connected Shopify store sites. *Open the web console to check if a site is connected.*
<!-- development environment concepts (end) -->

<!-- limitations (start) -->
## Limitations

- When the development task is running, the browser console throws a `bundle.css` missing error
- Already running Shopify tasks only upload files which are changed, a simple re-save of a file, without editing it, won't upload the file to the remote store
- Vue components inside `.liquid` files can only be used in a non-self-closing `<kebab-case></kebap-case>` manner
- `<style></style>` and `<script></script>` will be removed on mount inside Vue components (basically everything inside `<div id="app">...</div>`), use `<component is="style"><component>` and `<component is="script"></component>` instead
- Setting (different) delimeters for [renderless components](https://css-tricks.com/building-renderless-vue-components) does not seem to work within Vue Slots.  For now, use the v-text directive as a work-around
<!-- limitations (end) -->

<!-- credits (start) -->
## Credits
This project is based off [uicrooks/shopify-theme-lab](https://github.com/uicrooks/shopify-theme-lab/)
<!-- credits (end) -->