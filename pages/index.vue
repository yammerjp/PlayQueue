<template>
  <div>
    <div id="center-box">
      <div id="app">
        <h1>Play Queue</h1>
        <!--タブ選択バー-->
        <tabBar :selected-tab-number="tabCommon.selectedTab" @tab-change="tabChange" />
        <!--動画再生タブ-->
        <div :class="{'displayNone':tabCommon.selectedTab!=0}">
          <tabPlay
            :playerStart="tabCommon.playerStart"
            :tQloop="tQloop"
            :ListClickUniqueKey="tabCommon.ListClickUniqueKey"
            :tabQueueMvList="tabQueue.mvList"
            @add-movie-queue="addMovieQueue2"
            @move-cancel="moveCancel"
            @update-player-finish="updatePlayerFinish"
            @update-player-start="updatePlayerStart"
            @update-playing-movie="updatePlayingMovie"
            @update-tab-queue-mv-list="updateTabQueueMvList"
            @tab-change="tabChange"
            ref="tabPlayRef"
          />
        </div>

        <!--プレイリストタブ-->
        <div class="tab-queue" :class="{'displayNone':tabCommon.selectedTab!=1}">
          <div>プレイリスト</div>
          <div class="move-here" v-if="tabQueue.move.able" @click="moveHere(0)">here</div>
          <template v-if="tabCommon.playerStart">
            <div
              class="movie-list col s12 row"
              v-for="movie in tabQueue.mvList"
              :key="movie.uniqueKey"
            >
              <div
                class="card-panel grey lighten-5 z-depth-1 intab-card-panel"
                :class="{'now-play-movie':movie.uniqueKey===playingMovie.uniqueKey}"
              >
                <div
                  class="row valign-wrapper intab-row"
                  :class="{'now-move-movie':movie===tabQueue.mvList[tabQueue.move.from]}"
                >
                  <div
                    class="width100"
                    :class="{'selected':movie.uniqueKey===tabCommon.ListClickUniqueKey}"
                    @click="listMovieClicked(movie)"
                  >
                    <div class="col s3">
                      <img :src="movie.thumbnail" alt class="responsive-img" />
                    </div>
                    <div class="col s9">
                      <span class="black-text">
                        <div class="title">{{movie.title}}</div>
                        <div class="description">{{movie.description210}}</div>
                        <div class="information">{{movie.publishedAt}}投稿</div>
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="selected-movie-s12"
                  v-if="movie.uniqueKey===tabCommon.ListClickUniqueKey"
                  @click="listMovieClicked(movie)"
                >
                  <!--クリックされている∧再生中でない⇒表示-->
                  <div
                    v-if="movie.uniqueKey!==playingMovie.uniqueKey"
                    :id="movie.uniqueKey+'-not-playing'"
                  >
                    <button
                      class="btn waves-effect waves-light"
                      @click="changeMovieQueue('JUMP',movie)"
                    >
                      <i class="material-icons">play_arrow</i>今すぐ再生
                    </button>
                    <button
                      class="btn waves-effect waves-light"
                      @click="changeMovieQueue('DELETE',movie)"
                    >
                      <i class="material-icons">clear</i>リストから削除
                    </button>
                    <button
                      class="btn waves-effect waves-light"
                      @click="changeMovieQueue('MOVE',movie)"
                    >
                      <i class="material-icons">format_line_spacing</i>移動
                    </button>
                  </div>
                  <div v-else :id="movie.uniqueKey+'-playing'">
                    <button
                      class="btn waves-effect waves-light"
                      @click="changeMovieQueue('JUMP',movie)"
                    >
                      <i class="material-icons">play_arrow</i>最初から再生
                    </button>
                    <button class="btn waves-effect waves-light disabled">
                      <i class="material-icons">clear</i>リストから削除
                    </button>
                    <button class="btn waves-effect waves-light disabled">
                      <i class="material-icons">format_line_spacing</i>移動
                    </button>
                  </div>
                </div>
              </div>
              <div class="move-here" v-if="tabQueue.move.able" @click="moveHere(movie)">here</div>
            </div>
          </template>
          <div class="settings">
            <div class="switch">
              <span class="switch-caption">ループ:</span>
              <label>
                Off
                <input type="checkbox" v-model="tQloop" />
                <span class="lever"></span>
                On
              </label>
            </div>
            <div class="switch">
              <span class="switch-caption" :class="{strikeout:tQloop}">末尾の関連動画を自動再生する:</span>
              <label>
                Off
                <input :disabled="tQloop" type="checkbox" v-model="tQautoPlayRelatedMovie" />
                <span class="lever"></span>
                <span :class="{strikeout:tQloop}">On</span>
              </label>
            </div>
            <div class="switch">
              <span
                class="switch-caption"
                :class="{strikeout: !tQautoPlayRelatedMovie || tQloop}"
              >新しい関連動画のみ:</span>
              <label>
                Off
                <input
                  :disabled="!tQautoPlayRelatedMovie || tQloop"
                  type="checkbox"
                  v-model="tQautoPlayNewRelatedMovie"
                />
                <span class="lever"></span>
                <span :class="{strikeout: !tQautoPlayRelatedMovie || tQloop}">On</span>
              </label>
            </div>
          </div>
          <!--リストを保存、開く機能-->
          <saveList
            :displayedMoviesProps="tabQueue.mvList"
            @new-displayedMovies="updateTabQueueMvList"
            @move-cancel="moveCancel"
            @manipulate-player="manipulatePlayer"
          />
        </div>

        <!--検索リストタブ-->
        <div :class="{'displayNone':tabCommon.selectedTab!=2}">
          <tabSearch
            :emphasizedMovieUniqueKey="tabCommon.ListClickUniqueKey"
            @add-movie-queue="addMovieQueue2"
          />
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
import tabSearch from "@/components/tabSearch.vue";
import saveList from "@/components/saveList.vue";
const iziToast = require("izitoast");
const uuidv4 = require("uuid/v4");

let player;
export default {
  components: {
    tabBar,
    movieList,
    tabPlay,
    tabSearch,
    saveList
  },
  data: () => {
    return {
      tabQueue: {
        mvList: [
          //movieQueue
          emptyMovie
        ],
        move: {
          able: false, //movable
          from: -1 //moveFrom
        }
      },
      tabCommon: {
        ListClickUniqueKey: "", //ListClickUniqueKey
        selectedTab: 0, // selectedTab
        playerStart: false
      },
      tQloop: false,
      tQautoPlayRelatedMovie: false,
      tQautoPlayNewRelatedMovie: false,
      playingMovie: emptyMovie
    };
  },
  watch: {
    tQloop: function(newVal, oldVal) {
      if (newVal && !oldVal && this.tabCommon.playerStart) {
        this.manipulatePlayer("playRestart");
      }
    },
    tQautoPlayRelatedMovie: function(newVal, oldVal) {
      if (newVal && !oldVal && this.tabCommon.playerStart) {
        this.manipulatePlayer("playRestart");
      }
    }
  },
  /*mounted(){
  },*/
  methods: {
    debugFunction() {
      //      console.log(this.tabQueue)
      //      console.log(YoutubeKey)
      console.log(this.tabQueue.mvList);
    },
    addMovieQueue2: function({ message, movie }) {
      this.addMovieQueue(message, movie);
    },
    addMovieQueue: function(msg, movie) {
      if (
        this.tabQueue.mvList.length === 1 &&
        this.tabQueue.mvList[0].Id === ""
      ) {
        this.tabQueue.mvList = [];
      }
      let pushedMv = Object.assign({}, movie);
      pushedMv.uniqueKey = uuidv4();
      console.log(pushedMv);
      let messageWord; //動画を再生リストへ追加したことを通知 2019/6/9 add
      const i = this.tabQueue.mvList.findIndex(({uniqueKey}) => {
        return uniqueKey === this.playingMovie.uniqueKey;
      });
      switch (msg) {
        case "PLAY_NOW":
          this.tabQueue.mvList = insert2list(
            this.tabQueue.mvList,
            i + 1,
            pushedMv
          );
          this.tabChange(0); //再生タブへ強制遷移 2019/6/9 add
          this.manipulatePlayer(
            "playSpecifyMovieOfTabQueue",
            pushedMv.uniqueKey
          );
          messageWord = "挿入";
          break;
        case "PLAY_NEXT":
          this.tabQueue.mvList = insert2list(
            this.tabQueue.mvList,
            i + 1,
            pushedMv
          );
          this.manipulatePlayer("playRestart"); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "挿入";
          break;
        case "PLAY_LAST":
          this.tabQueue.mvList.push(pushedMv);
          this.manipulatePlayer("playRestart"); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "追加";
          break;
      }
      iziToast.show({
        position: "topRight",
        title: "Add movie to the playlist",
        message: `再生リストに動画「${pushedMv.title}」を${messageWord}しました。`
      }); //動画を再生リストへ追加したことを通知 2019/6/9 add

      function insert2list(list = [], indexInsert = 0, movie) {
        if (indexInsert < 0 || indexInsert > list.length) {
          console.log("insert2list's argument 'indexInsert' is invalid");
          console.log(indexInsert);
          return undefined;
        }
        if (indexInsert === 0) {
          return [movie, ...list];
        }
        if (indexInsert === list.length) {
          return [...list, movie];
        }
        return [
          ...list.slice(0, indexInsert),
          movie,
          ...list.slice(indexInsert)
        ];
      }
    },
    changeMovieQueue(msg, movie) {
      const movieCt = this.tabQueue.mvList.findIndex(movie => {
        return movie.uniqueKey === movie.uniqueKey;
      });
      /*↑uniqueキーが一致するtabQueue.mvListの配列番号 つまりmovieが存在するtabQueue.mvList配列内の位置 */
      switch (msg) {
        case "JUMP": //movieの位置に再生キューを移動して再生
          this.manipulatePlayer("playSpecifyMovieOfTabQueue", movie.uniqueKey);
          this.tabChange(0); //再生タブへ強制遷移 2019/6/10 add
          break;
        case "DELETE": //movieを再生キューから削除
          this.tabQueue.mvList.splice(movieCt, 1); //削除
          break;
        case "MOVE": //movieの位置を移動して再生キュー内の順番を変更
          if (this.tabQueue.move.able) this.moveCancel();
          this.tabQueue.move.from = movieCt;
          //削除前に、移動する動画の場所を保存しておく
          this.tabQueue.move.able = true;
          /*選択画面を挟んでから移動先が決定 */
          break;
      }
    },
    moveHere(movie) {
      const movieFrom = this.tabQueue.mvList[this.tabQueue.move.from];
      if (movie !== 0 && movieFrom.uniqueKey === movie.uniqueKey) {
        //同じ場所に変更しろと言われたらキャンセル
        this.moveCancel();
        return 0;
      }
      this.tabQueue.mvList.splice(this.tabQueue.move.from, 1); //削除

      let movieCt;
      if (movie === 0) {
        movieCt = -1; //一番上に挿入する場合
      } else {
        movieCt = this.tabQueue.mvList.findIndex(
          ({ uniqueKey }) => uniqueKey === movie.uniqueKey
        );
      }
      this.tabQueue.mvList.splice(movieCt + 1, 0, movieFrom); //予め保存していたデータをリストに挿入
      this.moveCancel();

      this.manipulatePlayer("playRestart"); //もし最後尾に再生するものが増えていたら再生してくれる。
    },
    moveCancel() {
      this.tabQueue.move.able = false;
      this.tabQueue.move.from = -1;
    },
    listMovieClicked(movie) {
      if (this.tabCommon.ListClickUniqueKey === movie.uniqueKey) {
        this.tabCommon.ListClickUniqueKey = "";
      } else {
        this.tabCommon.ListClickUniqueKey = movie.uniqueKey;
      }
    },
    tabChange(num) {
      this.tabCommon.ListClickUniqueKey = "";
      this.tabCommon.selectedTab = num;
      this.moveCancel();
    },
    updateTabQueueMvList(movies) {
      console.log("updateTabQueueMvList");
      console.log(movies);
      this.tabQueue.mvList = movies;
    },
    updatePlayerStart(boolean) {
      this.tabCommon.playerStart = boolean;
    },
    updatePlayingMovie(movie) {
      this.playingMovie = movie;
    },
    manipulatePlayer(msg, uniqueKey = undefined) {
      switch (msg) {
        case "playFirstMovie":
          console.log("playFirstMovie of manipulatePlayer");
          this.$refs.tabPlayRef.playFirstMovie();
          break;
        case "playSpecifyMovieOfTabQueue":
          if (uniqueKey === undefined) {
            this.$refs.tabPlayRef.playFirstMovie();
            return;
          }
          this.$refs.tabPlayRef.playSpecifyMovie(uniqueKey);
          break;
        case "playNextMovie":
          this.$refs.tabPlayRef.playNextMovie();
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
  right: 0.5em;
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