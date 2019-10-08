<template>
  <div>
    <div id="center-box">
      <div id="app">
        <h1>Play Queue</h1>
        <!--タブ選択バー-->
        <tabBar :selected-tab="selectedTab" @tab-change="tabChange" />
        <!--動画再生タブ-->
        <div :class="{'displayNone':selectedTab!='TAB_PLAY'}">
          <tabPlay
            :playerStart="playerStart"
            :tQloop="tQloop"
            :tQautoPlayRelatedMovie="tQautoPlayRelatedMovie"
            :moviesQueue="moviesQueue"
            @add-movie-queue="addMovieQueue"
            @move-cancel="moveCancel"
            @update-player-start="updatePlayerStart"
            @update-playing-movie="updatePlayingMovie"
            @push-movies-queue="pushMoviesQueue"
            @tab-change="tabChange"
            ref="tabPlayRef"
          />
        </div>

        <!--プレイリストタブ-->
        <div class="tab-queue" :class="{'displayNone':selectedTab!='TAB_QUEUE'}">
          <tabQueue
            :playerStart="playerStart"
            :playingMovie="playingMovie"
            @manipulatePlayer="manipulatePlayer"
            @update-tQloop="updateTQloop"
            @update-tQautoPlayRelatedMovie="updateTQautoPlayRelatedMovie"
            @update-moviesQueue="updatedMoviesQueue"
            @tab-change="tabChange"
            ref="tabQueueRef"
          />
        </div>

        <!--検索リストタブ-->
        <div :class="{'displayNone':selectedTab!='TAB_SEARCH'}">
          <tabSearch @add-movie-queue="addMovieQueue" />
        </div>
      </div>
    </div>
    <div id="read-me-button">
      <a href="/readMe" target="_blank">
        <i class="material-icons">help</i>
      </a>
      <button @click="debugFunction">debug</button>
    </div>
  </div>
</template>

<script>
import fetchYoutubeDataV3 from "@/assets/js/fetch-youtube-data-v3.js";
import emptyMovie from "@/assets/js/emptyMovie.js";
import tabBar from "@/components/tabBar.vue";
import movieList from "@/components/movieList.vue";
import tabPlay from "@/components/tabPlay.vue";
import tabQueue from "@/components/tabQueue.vue";
import tabSearch from "@/components/tabSearch.vue";

export default {
  components: {
    tabBar,
    movieList,
    tabPlay,
    tabQueue,
    tabSearch
  },
  data: () => {
    return {
      playingMovie: emptyMovie,
      selectedTab: "TAB_PLAY", // selectedTab
      playerStart: false,
      tQloop: false,
      tQautoPlayRelatedMovie: false,
      moviesQueue: [emptyMovie]
    };
  },
  /*mounted(){
  },*/
  methods: {
    debugFunction() {
      //      console.log(this.tabQueue)
      //      console.log(YoutubeKey)
      console.log(this.moviesQueue);
    },
    tabChange(tabName) {
      this.selectedTab = tabName;
      this.moveCancel();
    },

    updatePlayerStart(boolean) {
      this.playerStart = boolean;
    },
    updatePlayingMovie(movie) {
      this.playingMovie = movie;
    },
    updateTQloop(newVal) {
      this.tQloop = newVal;
    },
    updateTQautoPlayRelatedMovie(newVal) {
      this.tQautoPlayRelatedMovie = newVal;
    },
    updatedMoviesQueue(movies) {
      this.moviesQueue = movies;
    },
    pushMoviesQueue(movies) {
      this.$refs.tabQueueRef.pushMoviesQueue(movies);
    },
    addMovieQueue(obj) {
      this.$refs.tabQueueRef.addMovieQueue(obj);
    },
    moveCancel() {
      this.$refs.tabQueueRef.moveCancel();
    },
    manipulatePlayer({ message, key = undefined, movie = undefined }) {
      switch (message) {
        case "playSpecifyMovie":
          if (movie === undefined) {
            return;
          }
          this.$refs.tabPlayRef.playSpecifyMovie(movie);
          break;
        case "playRestart":
          this.$refs.tabPlayRef.playRestart();
          break;
      }
    }
  }
};
</script>

<style>
body {
  text-align: center;
  background-color: rgb(230, 230, 230);
}
h1 {
  font-family: "Anton", sans-serif;
  font-size: 1.5em;
  color: #da5019;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

#center-box {
  display: inline-block;
  min-height: 100vh;
  background-color: rgb(255, 255, 255);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
}

.tab-queue {
  width: 98%;
  margin: auto;
  display: inline-block;
}

#center-box {
  width: 100%;
  max-width: 640px;
}
.intab-card-panel {
  padding: 2px;
  margin: 0px;
}
.tab-row {
  margin-bottom: 3px;
}
.intab-row {
  margin-bottom: 3px;
  width: 100%;
}

.movie-list {
  margin-bottom: 0px;
}
.movie-list button {
  margin: 5px;
}

.title {
  text-align: left;
  font-size: 1em;
}

.movie-list .title {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;

  overflow: hidden;
  user-select: none; /* Firefox */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
.movie-list .selected .title {
  /*    text-overflow:clip;*/
  overflow-wrap: break-word;
  white-space: normal;
}
.description {
  margin: 0;
  text-align: left;
  font-size: 0.8em;
  color: rgb(71, 71, 71);

  width: 100%;
  overflow-wrap: break-word;
}
.movie-list .description {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  font-size: 0.8em;
  color: rgb(71, 71, 71);
  user-select: none; /* Firefox */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
.movie-list .selected .description {
  overflow-wrap: break-word;
  white-space: normal;
}
.information {
  font-size: 0.8em;
  color: rgb(71, 71, 71);
  text-align: right;
}

.col {
  margin-left: auto;
  margin-right: auto;
  padding: 0.25em;
}
.now-play-movie {
  border-style: solid;
  border-color: #da5019;
  border-radius: 3px;
}
.now-move-movie {
  background-color: rgb(139, 139, 139);
}
.move-here {
  background-color: #f3c0ab;
}
.list-name {
  margin-top: 2em;
  margin-bottom: 0.25em;
}
.settings {
  text-align: right;
  margin-right: 1em;
}
.switch-caption {
  color: rgb(32, 32, 32);
}
.strikeout {
  text-decoration: line-through;
  color: rgb(114, 114, 114);
}
.width100 {
  width: 100%;
}
/*.responsive-img{
    
}*/

.description .description-button {
  text-decoration: underline;
}

.read-me {
  padding: 1em;
  font-size: 0.8em;
}
#read-me-button {
  position: absolute;
  top: 0.5em;
}
#read-me-button > a {
  color: rgb(71, 71, 71);
}
#pre-first-messege {
  position: static;
}
#first-messege {
  /*
  position: absolute;
  top: 52%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
*/
  width: 100%;
  height: auto;
  font-size: 1.6em;
  color: rgb(48, 48, 48);
  box-sizing: content-box;
  z-index: 5;
}
.displayNone {
  display: none;
}
</style>