<template>
  <div id="tab-player">
    <div id="player-box">
      <div id="player-not-playing" v-if="!playerStart">
        <visitingDescription />
      </div>
      <div id="player-playing" v-else>
        <youtube
          :video-id="playingMovie.Id"
          ref="youtube"
          :resize="true"
          @ready="onPlayerReady"
          @error="onPlayerError"
          @ended="onPlayerEnded"
          :width="windowSize.width"
          :height="windowSize.height"
        ></youtube>
      </div>
    </div>
    <div class="title">{{playingMovie.title}}</div>
    <div class="description">
      <span id="short-description" v-if="!tabPlay.fullDescription">
        {{playingMovie.description210}}
        <span
          class="description-button"
          v-if="playingMovie.description210!==playingMovie.description"
          @click="tabPlay.fullDescription=true"
        >[全文表示&gt;&gt;]</span>
      </span>
      <span id="full-description" v-else>
        {{playingMovie.description}}
        <span
          class="description-button"
          @click="tabPlay.fullDescription=false"
        >[隠す&lt;&lt;]</span>
      </span>
    </div>
    <template v-if="playerStart">
      <div class="information">
        <span class="publishedAt">{{playingMovie.publishedAt}}投稿 /</span>
        <span class="duration">再生時間:{{playingMovie.duration}} /</span>
        <span class="viewCount">再生回数:{{playingMovie.viewCount}}回/</span>
        <span class="channelTitle">Channel: {{playingMovie.channelTitle}}</span>
      </div>

      <div class="list-name">関連動画</div>
      <movieList
        :movies="tabPlay.movies"
        :emphasizedMovieKey="playingMovie.key"
        :nextPlayKey="nextPlayKey"
        @add-movies-queue="addMoviesQueue"
      />

      <button @click="fetchMoreRelatedMovies" class="btn waves-effect waves-light">
        <i class="material-icons">keyboard_arrow_down</i>
      </button>
    </template>
  </div>
</template>
<script>
import fetchYoutubeDataV3 from "@/assets/js/fetch-youtube-data-v3.js";
import emptyMovie from "@/assets/js/emptyMovie.js";
import movieList from "@/components/movieList.vue";
import visitingDescription from "@/components/visitingDescription.vue";
const uuidv4 = require("uuid/v4");
const iziToast = require("izitoast");

export default {
  components: {
    movieList,
    visitingDescription
  },
  data: () => {
    return {
      tabPlay: {
        movies: [emptyMovie],
        nextPageToken: "",
        preWord: "relatedToVideoId=",
        wordSubmit: "", //
        fullDescription: false
      },
      playingMovie_: emptyMovie,
      playerIsReady: false,
      playerFinish: true //playerStop
    };
  },
  props: {
    playerStart: Boolean,
    atEndingQueue: String,
    moviesQueue: Array,
    windowSizeProps: Object
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    nextPlayKey() {
      console.log("called computed nextPlayKey");
      const movie = this.getNextMovie();
      if (movie === undefined || movie === null) {
        return undefined;
      }
      return movie.key;
    },
    playingMovie: {
      get: function() {
        return this.playingMovie_;
      },
      set: function(movie) {
        this.$emit("update-playing-movie", movie);
        this.playingMovie_ = movie;
      }
    },
    windowSize() {
      const movieSizeMax = {
        width: 640,
        height: 360
      };
      if (
        this.windowSizeProps.width >= movieSizeMax.width &&
        this.windowSizeProps.height >= movieSizeMax.height
      ) {
        return movieSizeMax;
      }
      if (this.windowSizeProps.width * 9 > this.windowSizeProps.height * 16) {
        return {
          width: Math.floor((this.windowSizeProps.height * 16) / 9),
          height: this.windowSizeProps.height
        };
      } else {
        return {
          width: this.windowSizeProps.width,
          height: Math.floor((this.windowSizeProps.width * 9) / 16)
        };
      }
    }
  },
  methods: {
    fetchMoreRelatedMovies(callback) {
      //[callback..リスト追加後に行われる関数 任意]
      if (this.playerStart == false) return;
      fetchYoutubeDataV3.getMovieList(this.tabPlay, false, undefined, callback);
    },
    playVideo() {
      if (this.playerStart == false) {
        this.$emit("update-player-start", true);
      }
      if (!this.playerIsReady) {
        return;
      }
      this.$emit("move-cancel");

      //関連動画リストの取得
      fetchYoutubeDataV3.getMovieList(this.tabPlay, true, this.playingMovie.Id);
      fetchYoutubeDataV3.getMovieInformation(this.playingMovie);
      this.tabPlay.fullDescription = false;

      this.playerFinish = false;
      setTimeout(this.player.playVideo, 100);
    },
    getNextMovie() {
      if (this.playerStart == false) {
        return this.moviesQueue[0];
      }

      // tabQueue上に次に再生すべきものがあればそれを再生
      const i = this.moviesQueue.findIndex(({ key }) => {
        return key === this.playingMovie.key;
      });
      if (i === -1) {
        console.log("error playingMovie is not found in moviesQueue");
        return null;
      }

      // リスト末尾でない
      if (i < this.moviesQueue.length - 1) {
        return this.moviesQueue[i + 1];
      }

      // リスト末尾

      // ループせず関連動画も再生しない
      if (this.atEndingQueue === "STOP") {
        return null;
      }

      // ループ
      if (this.atEndingQueue === "PLAY_QUEUE_TOP") {
        return this.moviesQueue[0];
      }

      // 最上位の関連動画を再生
      if (this.atEndingQueue === "PLAY_RELATED_MOVIE") {
        const nextMovie = this.tabPlay.movies[0];
        if (nextMovie === undefined) {
          console.log("not found to of related movie");
          return null;
        }
        return nextMovie;
      }

      // 未再生の関連動画を再生
      if (this.atEndingQueue === "PLAY_NEW_RELATED_MOVIE") {
        const nextMovie = this.tabPlay.movies.find(movieT => {
          return (
            this.moviesQueue.find(movieQ => {
              return movieT.Id === movieQ.Id;
            }) === undefined
          );
        });
        // 未再生の関連動画がリストにない場合はundefined
        return nextMovie;
      }
      console.log("unknown error");
      return null;
    },

    playNextMovie() {
      console.log("playNextMovie()");
      const nextMovie = this.getNextMovie();

      if (nextMovie === null) {
        return;
      }
      if (nextMovie === undefined) {
        // 未再生の関連動画を再生したいが、読み込み済みのものの中には存在しないので、続きを読み込んで再度playNextMovie()
        this.fetchMoreRelatedMovies(this.playNextMovie);
        return;
      }

      const nextMovieIsInMovieQueue = this.moviesQueue.find(({ key }) => {
        return key === nextMovie.key;
      });
      if (nextMovieIsInMovieQueue === undefined) {
        nextMovie.key = uuidv4();
        this.pushMoviesQueue(nextMovie);
      }
      this.playingMovie = nextMovie;
      this.playVideo();
    },
    playSpecifyMovie(movie) {
      this.playingMovie = movie;
      this.playVideo();
    },
    playRestart() {
      if (!this.playerFinish) {
        return;
      }
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
      if (!this.playerIsReady) {
        this.playerIsReady = true;
      }
      this.tabChange("TAB_PLAY");
      this.playSpecifyMovie(this.moviesQueue[0]);
    },
    onPlayerEnded() {
      this.playerFinish = true;
      this.playNextMovie();
    },

    pushMoviesQueue(movie) {
      this.$emit("push-movies-queue", movie);
      //      this.addMoviesQueue({ message: "PLAY_LAST", movie });
    },
    addMoviesQueue(obj) {
      this.$emit("add-movies-queue", obj);
    },
    tabChange(tabName) {
      this.$emit("tab-change", tabName);
    }
  }
};
</script>
<style scoped>
#player-box {
  /*youtube player 16:9固定 ↓*/
  position: relative;
  /*youtube player 16:9固定 ↑*/
}
#tab-player > .title {
  margin: 0.25em 1em;
  font-style: bold;
}
#tab-player > .description {
  padding: 0.25em 1em;

  box-sizing: border-box;
}
#tab-player .information {
  padding: 0.25em;
}
#full-description {
  white-space: pre-wrap;
}
</style>