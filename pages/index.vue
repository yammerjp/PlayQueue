<template>
  <div>
    <div id="center-box">
      <div id="app">
        <h1>Play Queue</h1>
        <!--タブ選択バー-->
        <tabBar :selected-tab-number="tabCommon.selectedTab" @tab-change="tabChange" />
        <!--動画再生タブ-->
        <div id="tab-player" v-bind:class="{'displayNone':tabCommon.selectedTab!=0}">
          <div id="player-box">
            <visitingDescription v-if="!tabCommon.playerStart" />
            <div id="player-playing" v-if="tabCommon.playerStart">
              <youtube
                :video-id="tabPlay.playingMovie.Id"
                ref="youtube"
                :resize="true"
                @ready="onPlayerReady"
                @error="onPlayerError"
                @ended="onPlayerEnded"
              ></youtube>
            </div>
          </div>
          <div class="title">{{tabPlay.playingMovie.title}}</div>
          <div class="description">
            <span
              class="short-description"
              v-bind:class="{'displayNone':tabPlay.fullDescription==true}"
            >
              {{tabPlay.playingMovie.description210}}
              <span
                class="description-button"
                v-bind:class="{'displayNone':tabPlay.playingMovie.description210==tabPlay.playingMovie.description}"
                v-on:click="tabPlay.fullDescription=true"
              >[全文表示&gt;&gt;]</span>
            </span>
            <span
              class="full-description"
              v-bind:class="{'displayNone':tabPlay.fullDescription==false}"
            >
              {{tabPlay.playingMovie.description}}
              <span
                class="description-button"
                v-on:click="tabPlay.fullDescription=false"
              >[隠す&lt;&lt;]</span>
            </span>
          </div>
          <div class="information" v-bind:class="{'displayNone':tabCommon.playerStart!=true}">
            <span class="publishedAt">{{tabPlay.playingMovie.publishedAt}}投稿 /</span>
            <span class="duration">再生時間:{{tabPlay.playingMovie.duration}} /</span>
            <span class="viewCount">再生回数:{{tabPlay.playingMovie.viewCount}}回/</span>
            <span class="channelTitle">Channel: {{tabPlay.playingMovie.channelTitle}}</span>
          </div>

          <div class="list-name" v-bind:class="{'displayNone':tabCommon.playerStart!=true}">関連動画</div>
          <movieList
            :movies="tabPlayMvListComputed"
            :emphasizedMovieUniqueKey="tabCommon.ListClickUniqueKey"
            :nextPlayUniqueKey="nextPlayUniqueKey"
            @add-movie-queue="addMovieQueue2"
          />

          <button
            v-on:click="relatedMovieMore"
            class="btn waves-effect waves-light"
            v-bind:class="{'displayNone':tabCommon.playerStart==false}"
          >
            <i class="material-icons">keyboard_arrow_down</i>
          </button>
        </div>

        <!--プレイリストタブ-->
        <div class="tab-queue" v-bind:class="{'displayNone':tabCommon.selectedTab!=1}">
          <div>プレイリスト</div>
          <div
            class="move-here"
            v-bind:class="{'displayNone':tabQueue.move.able==false}"
            v-on:click="moveHere(0)"
          >here</div>
          <div
            class="movie-list col s12 row"
            v-bind:class="{'displayNone':tabCommon.playerStart==false}"
            v-for="item in tabQueue.mvList"
            :key="item.uniqueKey"
          >
            <div
              class="card-panel grey lighten-5 z-depth-1 intab-card-panel"
              v-bind:class="{'now-play-movie':item.uniqueKey==tabPlay.playingMovie.uniqueKey}"
            >
              <div
                class="row valign-wrapper intab-row"
                v-bind:class="{'now-move-movie':item==tabQueue.mvList[tabQueue.move.from]}"
              >
                <div
                  class="width100"
                  v-bind:class="{'selected':item.uniqueKey==tabCommon.ListClickUniqueKey}"
                  v-on:click="listMovieClicked(item)"
                >
                  <div class="col s3">
                    <img v-bind:src="item.thumbnail" alt class="responsive-img" />
                  </div>
                  <div class="col s9">
                    <span class="black-text">
                      <div class="title">{{item.title}}</div>
                      <div class="description">{{item.description210}}</div>
                      <div class="information">{{item.publishedAt}}投稿</div>
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="selected-movie-s12"
                v-bind:class="{'displayNone':!(item.uniqueKey==tabCommon.ListClickUniqueKey)}"
                v-on:click="listMovieClicked(item)"
              >
                <!--クリックされている∧再生中でない⇒表示-->
                <div v-if="item.uniqueKey!==tabPlay.playingMovie.uniqueKey" :id="item.nextPlayUniqueKey+'-not-playing'">
                  <button
                    class="btn waves-effect waves-light"
                    v-on:click="changeMovieQueue('JUMP',item)"
                  >
                    <i class="material-icons">play_arrow</i>今すぐ再生
                  </button>
                  <button
                    class="btn waves-effect waves-light"
                    v-on:click="changeMovieQueue('DELETE',item)"
                  >
                    <i class="material-icons">clear</i>リストから削除
                  </button>
                  <button
                    class="btn waves-effect waves-light"
                    v-on:click="changeMovieQueue('MOVE',item)"
                  >
                    <i class="material-icons">format_line_spacing</i>移動
                  </button>
                </div>
                <div v-else :id="item.nextPlayUniqueKey+'-playing'">
                  <button
                    class="btn waves-effect waves-light"
                    v-on:click="changeMovieQueue('JUMP',item)"
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
            <div
              class="move-here"
              v-bind:class="{'displayNone':tabQueue.move.able==false}"
              v-on:click="moveHere(item)"
            >here</div>
          </div>
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
            <div class="switch" v-bind:class="{'displayNone':tQloop==true}">
              <span class="switch-caption">末尾の関連動画を自動再生する:</span>
              <label>
                Off
                <input type="checkbox" v-model="tQautoPlayRelatedMovie" />
                <span class="lever"></span>
                On
              </label>
            </div>
            <div class="switch" v-bind:class="{'displayNone':tQloop==false}">
              <span class="switch-caption strikeout">末尾の関連動画を自動再生する:</span>
              <label>
                Off
                <input disabled type="checkbox" v-model="tQautoPlayRelatedMovie" />
                <span class="lever"></span>
                <span class="strikeout">On</span>
              </label>
            </div>

            <div
              class="switch"
              v-bind:class="{'displayNone':tQautoPlayRelatedMovie==false||tQloop==true}"
            >
              <span class="switch-caption">新しい関連動画のみ:</span>
              <label>
                Off
                <input type="checkbox" v-model="tQautoPlayNewRelatedMovie" />
                <span class="lever"></span>
                On
              </label>
            </div>
            <div
              class="switch"
              v-bind:class="{'displayNone':tQautoPlayRelatedMovie==true&&tQloop==false}"
            >
              <span class="switch-caption strikeout">新しい関連動画のみ:</span>
              <label>
                Off
                <input disabled type="checkbox" v-model="tQautoPlayNewRelatedMovie" />
                <span class="lever"></span>
                <span class="strikeout">On</span>
              </label>
            </div>
          </div>
          <!--リストを保存、開く機能-->
          <saveList
            :displayedMoviesProps="tabQueue.mvList"
            @new-displayedMovies="updateTabQueueMvList"
            @move-cancel="moveCancel"
            @play-first-movie="manipulatePlayer('playFirstMovie')"
          />
        </div>

        <!--検索リストタブ-->
        <div v-bind:class="{'displayNone':tabCommon.selectedTab!=2}">
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
import tabSearch from "@/components/tabSearch.vue";
import saveList from "@/components/saveList.vue";
import visitingDescription from "@/components/visitingDescription.vue";
const iziToast = require("izitoast");
const uuidv4 = require("uuid/v4");

let player;
export default {
  components: {
    tabBar,
    movieList,
    tabSearch,
    saveList,
    visitingDescription
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
      tabPlay: {
        playingMovie: emptyMovie,
        mvList: [emptyMovie],
        nextPageToken: "",
        preWord: "relatedToVideoId=",
        wordSubmit: "", //
        fullDescription: false
      },
      tabCommon: {
        ListClickUniqueKey: "", //ListClickUniqueKey
        selectedTab: 0, // selectedTab
        playerFinish: true, //playerStop
        playerStart: false
      },
      tQloop: false,
      tQautoPlayRelatedMovie: false,
      tQautoPlayNewRelatedMovie: false
    };
  },
  watch: {
    tQloop: function(newVal, oldVal) {
      if (
        newVal == true &&
        oldVal == false &&
        this.tabCommon.playerStart == true
      ) {
        this.manipulatePlayer("playRestart");
      }
    },
    tQautoPlayRelatedMovie: function(newVal, oldVal) {
      if (
        newVal == true &&
        oldVal == false &&
        this.tabCommon.playerStart == true
      ) {
        this.manipulatePlayer("playRestart");
      }
    }
  },
  /*mounted(){
  },*/
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    nextPlayUniqueKey() {
      const movie = this.getNextMovieOfTabQueue();
      if (movie === undefined || movie === null) {
        return undefined;
      }
      return movie.uniqueKey;
    },
    tabQueueMvListCt() {
      return this.tabQueue.mvList.findIndex(movie => {
        return movie.uniqueKey === this.tabPlay.playingMovie.uniqueKey;
      });
    },
    tabPlayMvListComputed() {
      if (
        this.tabPlay.mvList.length === 1 &&
        this.tabPlay.mvList[0].uniqueKey === ""
      ) {
        return [];
      }
      return this.tabPlay.mvList;
    }
  },
  methods: {
    debugFunction() {
      //      console.log(this.tabQueue)
      //      console.log(YoutubeKey)
      console.log(this.tabPlay.mvList);
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
      switch (msg) {
        case "PLAY_NOW":
          this.tabQueue.mvList = insert2list(
            this.tabQueue.mvList,
            this.tabQueueMvListCt + 1,
            pushedMv
          );
          this.manipulatePlayer("playNextMovie");
          this.tabCommon.selectedTab = 0; //再生タブへ強制遷移 2019/6/9 add
          messageWord = "挿入";
          break;
        case "PLAY_NEXT":
          this.tabQueue.mvList = insert2list(
            this.tabQueue.mvList,
            this.tabQueueMvListCt + 1,
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

      function insert2list(list = [], indexInsert = 0, item) {
        if (indexInsert < 0 || indexInsert > list.length) {
          console.log("insert2list's argument 'indexInsert' is invalid");
          console.log(indexInsert);
          return undefined;
        }
        if (indexInsert === 0) {
          return [item, ...list];
        }
        if (indexInsert === list.length - 1) {
          return [...list, item];
        }
        return [
          ...list.slice(0, indexInsert),
          item,
          ...list.slice(indexInsert)
        ];
      }
    },
    changeMovieQueue(msg, item) {
      const itemCt = this.tabQueue.mvList.findIndex(
        movie=> {return movie.uniqueKey === item.uniqueKey}
      );
      /*↑uniqueキーが一致するtabQueue.mvListの配列番号 つまりitemが存在するtabQueue.mvList配列内の位置 */
      switch (msg) {
        case "JUMP": //itemの位置に再生キューを移動して再生
          this.manipulatePlayer("playSpecifyMovieOfTabQueue",itemCt);
          this.tabCommon.selectedTab = 0; //再生タブへ強制遷移 2019/6/10 add
          break;
        case "DELETE": //itemを再生キューから削除
          this.tabQueue.mvList.splice(itemCt, 1); //削除
          break;
        case "MOVE": //itemの位置を移動して再生キュー内の順番を変更
          if (this.tabQueue.move.able) this.moveCancel();
          this.tabQueue.move.from = itemCt;
          //削除前に、移動する動画の場所を保存しておく
          this.tabQueue.move.able = true;
          /*選択画面を挟んでから移動先が決定 */
          break;
      }
    },
    moveHere(item) {
      const itemFrom = this.tabQueue.mvList[this.tabQueue.move.from];
      if (itemFrom == item) {
        //同じ場所に変更しろと言われたらキャンセル
        this.moveCancel();
        return 0;
      }
      this.tabQueue.mvList.splice(this.tabQueue.move.from, 1); //削除

      let itemCt;
      if (item === 0) {
        itemCt = -1; //一番上に挿入する場合
      } else {
        itemCt = this.tabQueue.mvList.findIndex(
          ({ uniqueKey }) => uniqueKey === item.uniqueKey
        );
      }
      this.tabQueue.mvList.splice(itemCt + 1, 0, itemFrom); //予め保存していたデータをリストに挿入
      this.tabQueue.move.from = -1;
      this.tabQueue.move.able = false;

      this.manipulatePlayer("playRestart"); //もし最後尾に再生するものが増えていたら再生してくれる。
    },
    moveCancel() {
      this.tabQueue.move.able = false;
      this.tabQueue.move.from = -1;
    },
    listMovieClicked(movie) {
      if (this.tabCommon.ListClickUniqueKey == movie.uniqueKey) {
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
    relatedMovieMore(callback) {
      //[callback..リスト追加後に行われる関数 任意]
      if (this.tabCommon.playerStart == false) return;
      fetchYoutubeDataV3.getMovieList(this.tabPlay, false, undefined, callback);
    },
    playVideo() {
      //再生しようとした動画が移動操作中の場合キャンセル
      if (
        this.tabQueue.move.able == true &&
        this.tabQueue.move.from == this.tabQueueMvListCt
      ) {
        this.moveCancel();
      }

      //関連動画リストの取得
      fetchYoutubeDataV3.getMovieList(
        this.tabPlay,
        true,
        this.tabPlay.playingMovie.Id
      );

      fetchYoutubeDataV3.getMovieInformation(this.tabPlay.playingMovie);
      this.tabPlay.fullDescription = false;

      this.tabCommon.playerFinish = false;
      setTimeout(() => {
        this.player.playVideo();
      }, 10);
    },
    playFirstMovie() {
      if (this.tabCommon.playerStart == false) {
        this.tabCommon.playerStart = true;
      }
      this.tabPlay.playingMovie = this.tabQueue.mvList[0];
      this.playVideo();
    },
    getNextMovieOfTabQueue() {
      const i = this.tabQueueMvListCt;

      console.log(i);
      if (i === -1) {
        return undefined;
      }
      // リスト末尾でないなら
      if (i < this.tabQueue.mvList.length - 1) {
        return this.tabQueue.mvList[i + 1];
      }
      if (this.tQloop === true) {
        return this.tabQueue.mvList[0];
      }

      return null;
    },
    playNextMovie() {
      console.log("playNextMovie()");
      if (this.tabCommon.playerStart == false) {
        this.playFirstMovie();
      }

      // tabQueue上に次に再生すべきものがあればそれを再生
      let nextMovie = this.getNextMovieOfTabQueue();
      if (nextMovie === undefined) {
        return;
      }
      if (nextMovie !== null) {
        this.tabPlay.playingMovie = nextMovie;
        this.playVideo();
        return;
      }

      // ループせず関連動画も再生しない
      if (this.tQautoPlayRelatedMovie === false) {
        return;
      }

      // 最上位の関連動画を再生
      if (this.tQautoPlayNewRelatedMovie === false) {
        nextMovie = this.tabPlay.mvList[0];
        if (nextMovie === undefined) {
          return;
        }
        this.updateTabQueueMvList([...this.tabQueue.mvList, nextMovie]);
        this.tabPlay.playingMovie = nextMovie;
        this.playVideo();
        return;
      }

      // 未再生の関連動画を再生
      nextMovie = this.tabPlay.mvList.find(movieT => {
        return (
          this.tabQueue.mvList.find(movieQ => {
            return movieT.Id === movieQ.Id;
          }) === undefined
        );
      });
      // 存在しなければ続きを読み込んで再度playNextMovie()
      if (nextMovie === undefined) {
        this.relatedMovieMore(this.playNextMovie);
        return;
      }
      // 存在すれば続きを再生リストに追加してplayNextMovie()
      this.addMovieQueue("PLAY_NOW", nextMovie);
      this.playNextMovie();
    },
    onPlayerError(event) {
      switch (event.data) {
        case 100: //動画が見つからない(非公開含む)
          this.playNextMovie();
          iziToast.error({
            position: "topRight",
            title: "Skip Movie",
            message: "動画が見つかりません。削除や非公開化によるものです。"
          });
          break;
        case 101: //埋め込み不可の動画
        case 150: //埋め込み不可の動画
          this.playNextMovie();
          iziToast.error({
            position: "topRight",
            title: "Skip Movie",
            message: "埋め込み不可の動画です。"
          });
          break;
        case 2: //リクエストが無効なパラメータ値 動画IDのフォーマットが異なる
          this.playNextMovie();
          iziToast.error({
            position: "topRight",
            title: "Skip Movie",
            message:
              "Youtubeへの再生リクエストに無効なパラメータが設定されました。動画IDのフォーマットが異なる可能性があります。"
          });
          break;
        case 5: //HTML5プレイヤーに関するエラー
          this.playNextMovie();
          iziToast.error({
            position: "topRight",
            title: "Skip Movie",
            message: "HTML5プレイヤーに関するエラーが発生しました。"
          });
          break;

        default:
          iziToast.error({
            position: "topRight",
            title: "Unknown Error",
            message: "Stop movie"
          });
      }
    },
    onPlayerReady(event) {
      console.log("player ready");
      this.tabChange(0);
      this.playVideo();
    },
    onPlayerEnded() {
      this.tabCommon.playerFinish = true;
      this.playNextMovie();
    },
    playRestart() {
      if (!this.tabCommon.playerFinish) {
        return;
      }
      this.playNextMovie();
    },
    updateTabQueueMvList(movies) {
      console.log("updateTabQueueMvList");
      console.log(movies);
      this.tabQueue.mvList = movies;
    },
    manipulatePlayer(msg, number=undefined) {
      switch (msg) {
        case "playFirstMovie":
          this.playFirstMovie();
          break;
        case "playSpecifyMovieOfTabQueue":
          if(number===0){
            this.playFirstMovie()
            break
          }
          this.tabPlay.playingMovie = this.tabQueue.mvList[number - 1];
        case "playNextMovie":
          this.playNextMovie();
          break;
        case "playRestart":
          this.playRestart();
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

#player-box {
  /*youtube player 16:9固定 ↓*/
  position: relative;
  width: 100%;
  /*youtube player 16:9固定 ↑*/
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

#tab-player > .title {
  margin: 0.25em 1em;
  font-style: bold;
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
#tab-player > .description {
  padding: 0.25em 1em;

  box-sizing: border-box;
}
#tab-player .information {
  padding: 0.25em;
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
.full-description {
  white-space: pre-wrap;
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