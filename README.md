# Play Queue

## Description

Web application to play Youtube in a row.

You can make original playlists of youtube moveis while playing a youtube movie.

## How to use

open [Play Queue](https://basd4g.github.io/PlayQueue/) on web browswer.

1. open Search-Tab(right), and add movie to a playlist.
1. open Play-Tab(left), and stop and start a movie.
1. open Playlist-Tab(center), and sort movies.

## Developing

This application is being developed now to change from Vue.js(CDN version) to Nuxt.js.

Release branch is [gh-pages](https://github.com/basd4g/PlayQueue/tree/gh-pages), it use Vue.js(CDN version).

## Install and run

### Get Youtube data API v3 key

1. Create a new project on [Google Cloud Platform Console](https://console.developers.google.com/).
1. Create a new credential of API key for Youtube Data API.
1. Copy the API key to the clipboard.

hint: [Youtube Data API](https://developers.google.com/youtube/v3/getting-started)

### git clone & run

```sh
$ git clone https://github.com/basd4g/PlayQueue.git
$ cd PlayQueue
$ git checkout origin/refactoring/devideComponent
$ git checkout -b refactoring/devideComponent

$ yarn

$ echo 'module.exports = "YOUR_YOUTUBE_DATA_API_KEYS"' > youtube-keys.js
# You have to replace your API key  with YOUR_YOUTUBE_DATA_API_KEYS .
# You can paste your API key from the clipboard if you copy it.

$ yarn dev
# Open a page http://localhost:3000/ with a web browser.
```
