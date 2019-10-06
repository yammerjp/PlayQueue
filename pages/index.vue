<template>
  <div>
    <div id="center-box">
      <div id="app">
        <h1>Play Queue</h1>
        <!--タブ選択バー-->
        <tabBar :selected-tab-number="tabCommon.selectedTab" @tab-change="tabChange"/>
        <!--動画再生タブ-->
        <div id="tab-player" v-bind:class="{'displayNone':tabCommon.selectedTab!=0}">
          <div id="player-box">
            <visitingDescription v-if="!tabCommon.playerStart" />
            <div id="player-playing" v-if="tabCommon.playerStart">
            <youtube
              :video-id="videoId"
              ref="youtube"
              :resize='true'
              @ready="onPlayerReady"
              @error="onPlayerError"
              @ended="playNextMovie"
            ></youtube>
            </div>
          </div>
          <div class="title">{{tabQueue.mvList[tabQueue.mvListCt].title}}</div>
          <div class="description">
            <span
              class="short-description"
              v-bind:class="{'displayNone':tabPlay.fullDescription==true}"
            >
              {{tabQueue.mvList[tabQueue.mvListCt].description210}}
              <span
                class="description-button"
                v-bind:class="{'displayNone':tabQueue.mvList[tabQueue.mvListCt].description210==tabQueue.mvList[tabQueue.mvListCt].description}"
                v-on:click="tabPlay.fullDescription=true"
              >[全文表示&gt;&gt;]</span>
            </span>
            <span
              class="full-description"
              v-bind:class="{'displayNone':tabPlay.fullDescription==false}"
            >
              {{tabQueue.mvList[tabQueue.mvListCt].description}}
              <span
                class="description-button"
                v-on:click="tabPlay.fullDescription=false"
              >[隠す&lt;&lt;]</span>
            </span>
          </div>
          <div class="information" v-bind:class="{'displayNone':tabCommon.playerStart!=true}">
            <span class="publishedAt">{{tabQueue.mvList[tabQueue.mvListCt].publishedAt}}投稿 /</span>
            <span class="duration">再生時間:{{tabQueue.mvList[tabQueue.mvListCt].duration}} /</span>
            <span class="viewCount">再生回数:{{tabQueue.mvList[tabQueue.mvListCt].viewCount}}回/</span>
            <span class="channelTitle">Channel: {{tabQueue.mvList[tabQueue.mvListCt].channelTitle}}</span>
          </div>

          <div class="list-name" v-bind:class="{'displayNone':tabCommon.playerStart!=true}">関連動画</div>
          <movieList :movies="tabPlay.mvList" :emphasizedMovieUniqueKey="tabCommon.ListClickUniqueKey" :nextPlayUniqueKey="nextPlayUniqueKey" @add-movie-queue="addMovieQueue2"/>

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
              v-bind:class="{'now-play-movie':item.uniqueKey==tabQueue.mvList[tabQueue.mvListCt].uniqueKey}"
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
                <div v-bind:class="{'displayNone':item==tabQueue.mvList[tabQueue.mvListCt] }">
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
                <div v-bind:class="{'displayNone':item!=tabQueue.mvList[tabQueue.mvListCt]}">
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
            :nowPlayingNumberProps="tabQueue.mvListCt"
            :tabCommonPlayerStart="tabCommon.playerStart"
            @new-displayedMovies="updateTabQueueMvList"
            @update-now-playing-number="updateTabQueueMvListCt"
            @move-cancel="moveCancel"
            @play-next-movie="playNextMovie" />
        </div>

        <!--検索リストタブ-->
        <tabSearch
          v-bind:class="{'displayNone':tabCommon.selectedTab!=2}"
          :emphasizedMovieUniqueKey="tabCommon.ListClickUniqueKey"
          @add-movie-queue="addMovieQueue2"/>
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
import fetchYoutubeDataV3 from '@/assets/js/fetch-youtube-data-v3.js'
import tabBar from '@/components/tabBar.vue'
import movieList from '@/components/movieList.vue'
import tabSearch from '@/components/tabSearch.vue'
import saveList from '@/components/saveList.vue'
import visitingDescription from '@/components/visitingDescription.vue'
const iziToast = require("izitoast");


const TAB_PLAYER = 0;
const TAB_QUEUE = 1;
const TAB_SEARCH = 2;
const SEARCHED = 0;
const RELATED = 1;
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
          {
            Id: "",
            description210: "",
            thumbnail: "",
            title: "",
            uniqueKey: "",
            publishedAt: "",
            description: "",
            duration: "",
            viewCount: "",
            channelTitle: ""
          }
        ],
        mvListCt: 0, //movieQueueCt
        move: {
          able: false, //movable
          from: -1 //moveFrom
        },
      },
      tabPlay: {
        mvList: [],
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
      tQautoPlayNewRelatedMovie: false,
      videoId: ""
    };
  },
  watch: {
    tQloop: function(newVal, oldVal) {
      if (
        newVal == true &&
        oldVal == false &&
        this.tabCommon.playerStart == true
      ) {
        this.playRestart();
      }
    },
    tQautoPlayRelatedMovie: function(newVal, oldVal) {
      if (
        newVal == true &&
        oldVal == false &&
        this.tabCommon.playerStart == true
      ) {
        this.playRestart();
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
      if(this.tabPlay.mvList[0]===undefined) {
        return undefined
      }
      if( this.tQloop===false 
          && this.tQautoPlayRelatedMovie===true
          && this.tabQueue.mvListCt + 1 >= this.tabQueue.mvList.length)
      {
        return this.tabPlay.mvList[0].uniqueKey
      } else {
        return undefined
      }

    }
  },
  methods: {
    debugFunction(){
//      console.log(this.tabQueue)
//      console.log(YoutubeKey)
      console.log(this.tabPlay.mvList)
    },
    addMovieQueue2: function({message, movie}){this.addMovieQueue(message,movie)},
    addMovieQueue: function(msg, movie) {
      if(this.tabQueue.mvList.length===1 && this.tabQueue.mvList[0].Id==="") {
        this.tabQueue.mvList = []
      }
      const date = new Date();
      let pushedMv = Object.assign({}, movie);
      pushedMv.uniqueKey = `${date.getTime()}#added`;
      console.log(pushedMv)
      let messageWord; //動画を再生リストへ追加したことを通知 2019/6/9 add
      switch (msg) {
        case "PLAY_NOW":
          this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, pushedMv);
          this.playNextMovie();
          this.tabCommon.selectedTab = 0; //再生タブへ強制遷移 2019/6/9 add
          messageWord = "挿入";
          break;
        case "PLAY_NEXT":
          this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, pushedMv);
          this.playRestart(); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "挿入";
          break;
        case "PLAY_LAST":
          this.tabQueue.mvList.push(pushedMv);
          this.playRestart(); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "追加";
          break;
      }
      iziToast.show({
        position: "topRight",
        title: "Add movie to the playlist",
        message:
          "再生リストに動画「" +
          pushedMv.title +
          "」を" +
          messageWord +
          "しました。"
      }); //動画を再生リストへ追加したことを通知 2019/6/9 add
    },
    changeMovieQueue(msg, item) {
      const itemCt = this.tabQueue.mvList.findIndex(
        ({ uniqueKey }) => uniqueKey === item.uniqueKey
      );
      /*↑uniqueキーが一致するtabQueue.mvListの配列番号 つまりitemが存在するtabQueue.mvList配列内の位置 */
      switch (msg) {
        case "JUMP": //itemの位置に再生キューを移動して再生
          this.tabQueue.mvListCt = itemCt - 1;
          this.playNextMovie();
          this.tabCommon.selectedTab = 0; //再生タブへ強制遷移 2019/6/10 add
          break;
        case "DELETE": //itemを再生キューから削除
          this.tabQueue.mvList.splice(itemCt, 1); //削除
          if (this.tabQueue.mvListCt > itemCt)
            //削除に合わせてtabQueue.mvListCtも現在再生しているものを指すように適切に変更
            this.tabQueue.mvListCt--;
          break;

        case "MOVE": //itemの位置を移動して再生キュー内の順番を変更
          if (this.tabQueue.move.able == true) this.moveCancel();
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
      if (this.tabQueue.mvListCt > this.tabQueue.move.from)
        //削除に合わせてtabQueue.mvListCtも現在再生しているものを指すように適切に変更
        this.tabQueue.mvListCt--;

      let itemCt;
      if (item === 0) {
        itemCt = -1; //一番上に挿入する場合
      } else {
        itemCt = this.tabQueue.mvList.findIndex(
          ({ uniqueKey }) => uniqueKey === item.uniqueKey
        );
      }
      this.tabQueue.mvList.splice(itemCt + 1, 0, itemFrom); //予め保存していたデータをリストに挿入
      if (this.tabQueue.mvListCt > itemCt) this.tabQueue.mvListCt++; //挿入後はthis.tabQueue.mvListCtも適切に変更する必要がある
      this.tabQueue.move.from = -1;
      this.tabQueue.move.able = false;

      this.playRestart(); //もし最後尾に再生するものが増えていたら再生してくれる。
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
    playVideo(){
      setTimeout(()=>{this.player.playVideo()},10)
      
    },
    playNextMovie() {
      console.log("playNextMovie()")/*
      //ページロード後最初の再生時にプレイヤーはプレイヤーを読み込む。
      if (this.tabCommon.playerStart == false) {
        console.log("this.tabCommon.playerStart == false")
        console.log(this.player)
        //this.tabQueue.mvListに初めて動画が追加されたとき
        //divをiframe置き換えてプレイヤー設置
        //(準備が整ったらイベントトリガーでonPlayerReady()が実行される。)
        //つまり初回にこの関数が呼ばれたときは、再生処理はこの関数ではなくonPlayerReady()で行われる
        this.tabQueue.mvList.shift();
        this.tabQueue.mvListCt = 0;
        //        replacePlayer();
        this.videoId = this.tabQueue.mvList[0].Id; // 挿入した
        this.playVideo()
        this.tabCommon.playerStart = true;
        this.tabCommon.playerFinish = false;
        return;
      }*/
      if (this.tabCommon.playerStart == false) {
        this.tabCommon.playerStart = true
      }

      //this.tabQueue.mvListCtの更新
      if (this.tQloop == true) {
        //ループ
        this.tabQueue.mvListCt =
          (this.tabQueue.mvListCt + 1) % this.tabQueue.mvList.length;
      } else {
        if (this.tabQueue.mvListCt + 1 >= this.tabQueue.mvList.length) {
          //リストの末尾に到達
          if (this.tQautoPlayRelatedMovie == true) {
            //末尾動画の関連動画再生がOn
            let playMovie;
            if (this.tQautoPlayNewRelatedMovie == true) {
              //関連動画を未再生のものに限定
              for (
                let i = 0, iMax = this.tabPlay.mvList.length;
                i < iMax;
                i++
              ) {
                const isExistMv = this.tabQueue.mvList.find(mv => {
                  return mv.Id == this.tabPlay.mvList[i].Id;
                });
                if (isExistMv == undefined) {
                  playMovie = this.tabPlay.mvList[i];
                  break;
                }
              } //関連動画リストがすべて再生済みならリストの続きをロード後、コールバックでもう一度playNextMovie
              if (playMovie == undefined) {
                this.relatedMovieMore(this.playNextMovie);
                return;
              }
            } else {
              playMovie = this.tabPlay.mvList[0];
            }
            this.addMovieQueue("PLAY_NOW", playMovie);
          } else {
            //ループせず関連動画も再生しない
            this.tabCommon.playerFinish = true;
          }
          return 0;
        }
        this.tabQueue.mvListCt = this.tabQueue.mvListCt + 1;
      }

      fetchYoutubeDataV3.getMovieInformation(this.tabQueue.mvList[this.tabQueue.mvListCt]);
      this.tabPlay.fullDescription = false;

      //再生しようとした動画が移動操作中の場合キャンセル
      if (
        this.tabQueue.move.able == true &&
        this.tabQueue.move.from == this.tabQueue.mvListCt
      ) {
        this.moveCancel();
      }

      //関連動画リストの取得
      fetchYoutubeDataV3.getMovieList(
        this.tabPlay,
        true,
        this.tabQueue.mvList[this.tabQueue.mvListCt].Id
      );

      this.videoId = this.tabQueue.mvList[this.tabQueue.mvListCt].Id;
      this.playVideo();
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
    onPlayerReady(event) {/*
      fetchYoutubeDataV3.getMovieInformation(this.tabQueue.mvList[this.tabQueue.mvListCt]);
      fetchYoutubeDataV3.getMovieList(
        this.tabPlay,
        true,
        this.tabQueue.mvList[this.tabQueue.mvListCt].Id
      );
      this.playVideo();*/
    },
    playRestart() {
      if (this.tabCommon.playerFinish == true) {
        this.tabCommon.playerFinish = false;
        this.playNextMovie();
      }
    },
    updateTabQueueMvList(movies){
      this.tabQueue.mvList = movies
    },
    updateTabQueueMvListCt(number){
      this.tabQueue.mvListCt = number
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
#first-messege {/*
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