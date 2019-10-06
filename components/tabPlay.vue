<template>
  <div id="tab-player">
    <div id="player-box">
      <visitingDescription v-if="!playerStart" />
      <div id="player-playing" v-if="playerStart">
        <youtube
          :video-id="videoId"
          ref="youtube"
          :resize="true"
          @ready="onPlayerReady"
          @error="onPlayerError"
          @ended="playNextMovie"
        ></youtube>
      </div>
    </div>
    <div class="title">{{movie.title}}</div>
    <div class="description">
      <span class="short-description" v-bind:class="{'displayNone':fullDescription==true}">
        {{movie.description210}}
        <span
          class="description-button"
          v-bind:class="{'displayNone':movie.description210==movie.description}"
          v-on:click="fullDescription=true"
        >[全文表示&gt;&gt;]</span>
      </span>
      <span class="full-description" v-bind:class="{'displayNone':fullDescription==false}">
        {{movie.description}}
        <span
          class="description-button"
          v-on:click="fullDescription=false"
        >[隠す&lt;&lt;]</span>
      </span>
    </div>
    <div class="information" v-bind:class="{'displayNone':playerStart!=true}">
      <span class="publishedAt">{{movie.publishedAt}}投稿 /</span>
      <span class="duration">再生時間:{{movie.duration}} /</span>
      <span class="viewCount">再生回数:{{movie.viewCount}}回/</span>
      <span class="channelTitle">Channel: {{movie.channelTitle}}</span>
    </div>

    <div class="list-name" v-bind:class="{'displayNone':playerStart!=true}">関連動画</div>
    <movieList
      :movies="mvList"
      :emphasizedMovieUniqueKey="listClickUniqueKey"
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
const iziToast = require("izitoast");
export default {
  data: () => {
    return {
      mvList: [],
      nextPageToken: "",
      preWord: "relatedToVideoId=",
      wordSubmit: "", //
      fullDescription: false
    };
  },
  props: ["playerStart", "listClickUniqueKey", "movie", "nextPlayUniqueKey", "playerFinish"],
  methods: {
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
      /*
      fetchYoutubeDataV3.getMovieInformation(this.tabQueue.mvList[this.tabQueue.mvListCt]);
      fetchYoutubeDataV3.getMovieList(
        this.tabPlay,
        true,
        this.tabQueue.mvList[this.tabQueue.mvListCt].Id
      );
      this.playVideo();*/
    },
    playRestart() {
      if (playerFinish == true) {
        playerFinish = false;
        this.playNextMovie();
      }
    },
    addMovieQueue2: function(obj) {
      this.$emit("add-movie-queue", obj);
    },
    playNextMovie() {
      this.$emit('play-next-movie')
    }
  }
};
</script>
<style scoped>
</style>