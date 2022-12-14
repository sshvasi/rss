[![CI](https://github.com/sshvasi/fullstack-javascript-project-11/actions/workflows/build.yml/badge.svg)](https://github.com/sshvasi/fullstack-javascript-project-11/actions/workflows/build.yml)

# RSS Reader

RSS Reader is a service for aggregating RSS feeds. It allows you to add an unimited number of RSS feeds to the main stream, listens for new entries and updates the UI when they appear. You can see how the application works in the [demo](https://rss-viewer-app.vercel.app).

The main goal of this project was to learn how to use the pure DOM API to interact with the document and how to manage the UI update logic according to the MVC architecture without frameworks. It was also important to organize the network interaction correctly: a long polling pattern was used to update the feed.

## Features

- form is blocked during submission
- errors/success are handled and informative feedback is shown to the user
- click on the "view" button opens a modal window with a description of the post
- link to the post is marked as visited after clicking
- feed is updated (once every five seconds) when new posts appear

## Stack

- JS: yup, axios, onChange, i18next
- CI/CD: vercel, codeclimate, github actions
- Tests: jest, testing-library
- Bundler: webpack
- UI: bootstrap

## Structure

```sh
src
├── index.js
├── init.js
├── locales
│   ├── en.js
│   ├── index.js
│   ├── ru.js
│   └── yup.js
├── utils
│   ├── api.js
│   ├── constants.js
│   ├── parser.js
│   └── validator.js
└── view
    ├── feedback.js
    ├── feeds.js
    ├── form.js
    ├── index.js
    ├── modal.js
    └── posts.js
```

## Usage

1. Install

```sh
git clone git@github.com:sshvasi/rss.git
make install
```

2. Build and deploy

```sh
make build
make dev
```

3. Run linting

```sh
make lint
```
