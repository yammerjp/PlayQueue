<template>
  <div id="tab-player">
    <div id="player-box">
      <visitingDescription v-if="!playerStart" />
      <div id="player-playing" v-if="playerStart">
        <youtube
          :video-id="playingMovie.Id"
          ref="youtube"
          :resize="true"
          @ready="onPlayerReady"
          @error="onPlayerError"
          @ended="onPlayerEnded"
        ></youtube>
      </div>
    </div>
    <div class="title">{{playingMovie.title}}</div>
    <div class="description">
      <span class="short-description" v-bind:class="{'displayNone':tabPlay.fullDescription==true}">
        {{playingMovie.description210}}
        <span
          class="description-button"
          v-bind:class="{'displayNone':playingMovie.description210==playingMovie.description}"
          v-on:click="tabPlay.fullDescription=true"
        >[全文表示&gt;&gt;]</span>
      </span>
      <span class="full-description" v-bind:class="{'displayNone':tabPlay.fullDescription==false}">
        {{playingMovie.description}}
        <span
          class="description-button"
          v-on:click="tabPlay.fullDescription=false"
        >[隠す&lt;&lt;]</span>
      </span>
    </div>
    <div class="information" v-bind:class="{'displayNone':playerStart!=true}">
      <span class="publishedAt">{{playingMovie.publishedAt}}投稿 /</span>
      <span class="duration">再生時間:{{playingMovie.duration}} /</span>
      <span class="viewCount">再生回数:{{playingMovie.viewCount}}回/</span>
      <span class="channelTitle">Channel: {{playingMovie.channelTitle}}</span>
    </div>

    <div class="list-name" v-bind:class="{'displayNone':playerStart!=true}">関連動画</div>
    <movieList
      :movies="tabPlayMvListComputed"
      :emphasizedMovieUniqueKey="ListClickUniqueKey"
      :nextPlayUniqueKey="nextPlayUniqueKey"
      @add-movie-queue="addMovieQueue2"
    />

    <button
      v-on:click="relatedMovieMore"
      class="btn waves-effect waves-light"
      v-bind:class="{'displayNone':playerStart==false}"
    >
      <i class="material-icons">keyboard_arrow_down</i>
    </button>
  </div>
</template>
<script>
import fetchYoutubeDataV3 from "@/assets/js/fetch-youtube-data-v3.js";
import emptyMovie from "@/assets/js/emptyMovie.js";
import movieList from "@/components/movieList.vue";
import visitingDescription from "@/components/visitingDescription.vue";
const iziToast = require("izitoast");

export default {
  
  components: {
    movieList,
    visitingDescription
  },
  data: () => {
    return {
      tabPlay: {
        mvList: [emptyMovie],
        nextPageToken: "",
        preWord: "relatedToVideoId=",
        wordSubmit: "", //
        fullDescription: false
      },
      playingMovie_: emptyMovie,
      playerIsReady: false
    };
  },
  props:[
    'playerStart','ListClickUniqueKey','tabQueueMoveAble','tabQueueMoveFrom','tabQueueMvListCt',
    'playerFinish', 'tabQueueMvList', 'tQloop'
  ],
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
    tabPlayMvListComputed() {
      if (
        this.tabPlay.mvList.length === 1 &&
        this.tabPlay.mvList[0].uniqueKey === ""
      ) {
        return [];
      }
      return this.tabPlay.mvList;
    },
    playingMovie:{
      get: function(){
        return this.playingMovie_
      },
      set: function(movie){
        this.$emit('update-playing-movie',movie)
        this.playingMovie_ = movie
      }
    }
  },
  methods: {
    relatedMovieMore(callback) {
      //[callback..リスト追加後に行われる関数 任意]
      if (this.playerStart == false) return;
      fetchYoutubeDataV3.getMovieList(this.tabPlay, false, undefined, callback);
    },
    playVideo() {
      // onPlayerReady()が実行されたらもう一度playVideo()される
      if(!this.playerIsReady){
        return
      }
      //再生しようとした動画が移動操作中の場合キャンセル
      if (
        this.tabQueueMoveAble == true &&
        this.tabQueueMoveFrom == this.tabQueueMvListCt
      ) {
        this.$emit('move-cancel')
      }

      //関連動画リストの取得
      fetchYoutubeDataV3.getMovieList(
        this.tabPlay,
        true,
        this.playingMovie.Id
      );
      let movie = this.playingMovie
      fetchYoutubeDataV3.getMovieInformation(movie);
      this.playingMovie = movie
      this.tabPlay.fullDescription = false;

      this.$emit('update-player-finish',false)
      setTimeout(() => {
        this.player.playVideo();
      }, 10);
    },
    playFirstMovie() {
      console.log("playFirstMovie")
      if (this.playerStart == false) {
        this.$emit('update-player-start',true)
      }
      this.playingMovie = this.tabQueueMvList[0];
      this.playVideo();
    },
    getNextMovieOfTabQueue() {
      const i = this.tabQueueMvListCt;

      console.log(i);
      if (i === -1) {
        return undefined;
      }
      // リスト末尾でないなら
      if (i < this.tabQueueMvList.length - 1) {
        return this.tabQueueMvList[i + 1];
      }
      if (this.tQloop === true) {
        return this.tabQueueMvList[0];
      }

      return null;
    },
    playNextMovie() {
      console.log("playNextMovie()");
      if (this.playerStart == false) {
        this.playFirstMovie();
      }

      // tabQueue上に次に再生すべきものがあればそれを再生
      let nextMovie = this.getNextMovieOfTabQueue();
      if (nextMovie === undefined) {
        return;
      }
      if (nextMovie !== null) {
        this.playingMovie = nextMovie;
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
        this.updateTabQueueMvList([...this.tabQueueMvList, nextMovie]);
        this.playingMovie = nextMovie;
        this.playVideo();
        return;
      }

      // 未再生の関連動画を再生
      nextMovie = this.tabPlay.mvList.find(movieT => {
        return (
          this.tabQueueMvList.find(movieQ => {
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
//      this.addMovieQueue2({message:"PLAY_NOW", movie:nextMovie});
      this.updateTabQueueMvList([...this.tabQueueMvList, nextMovie]);
      this.playingMovie = nextMovie;
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
    onPlayerReady(event) {
      console.log("player ready");
      if(!this.playerIsReady){
        this.playerIsReady = true
      }
      this.$emit('tab-change',0)
      this.playFirstMovie()
    },
    onPlayerEnded() {
      this.$emit('update-player-finish',true)
      this.playNextMovie();
    },
    playRestart() {
      if (!this.playerFinish) {
        return;
      }
      this.playNextMovie();
    },
    addMovieQueue2:function(obj){
      this.$emit('add-movie-queue',obj)
    },
    playSpecifyMovie(uniqueKey){
      setTimeout(()=>{
              const movie = this.tabQueueMvList.find(mv=>{return mv.uniqueKey === uniqueKey})
      if(movie===undefined){
        console.log("ret")
        console.log(uniqueKey)
        return
      }
      this.playingMovie = movie
      this.playVideo()
      },100)
    },
    updateTabQueueMvList(movies){
      this.$emit('update-tab-queue-mv-list',movies)
    }
  }
};
</script>