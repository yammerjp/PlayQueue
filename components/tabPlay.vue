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
        @add-movie-queue="addMovieQueue"
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
    tQloop: Boolean,
    tQautoPlayRelatedMovie: Boolean,
    moviesQueue: Array
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    nextPlayKey() {
      const movie = this.getNextMovieOfTabQueue();
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
    }
  },
  methods: {
    fetchMoreRelatedMovies(callback) {
      //[callback..リスト追加後に行われる関数 任意]
      if (this.playerStart == false) return;
      fetchYoutubeDataV3.getMovieList(this.tabPlay, false, undefined, callback);
    },
    getNextMovieOfTabQueue() {
      const i = this.moviesQueue.findIndex(({ key }) => {
        return key === this.playingMovie.key;
      });

      console.log(i);
      if (i === -1) {
        return undefined;
      }
      // リスト末尾でないなら
      if (i < this.moviesQueue.length - 1) {
        return this.moviesQueue[i + 1];
      }
      if (this.tQloop === true) {
        return this.moviesQueue[0];
      }

      return null;
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
      setTimeout(this.player.playVideo,100)
    },
    playNextMovie() {
      console.log("playNextMovie()");
      if (this.playerStart == false) {
        this.playingMovie = this.moviesQueue[0]
        this.playVideo()
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
        nextMovie = this.tabPlay.movies[0];
        if (nextMovie === undefined) {
          return;
        }
        this.pushMoviesQueue(nextMovie);
        this.playingMovie = nextMovie;
        this.playVideo();
        return;
      }

      // 未再生の関連動画を再生
      nextMovie = this.tabPlay.movies.find(movieT => {
        return (
          this.moviesQueue.find(movieQ => {
            return movieT.Id === movieQ.Id;
          }) === undefined
        );
      });
      // 存在しなければ続きを読み込んで再度playNextMovie()
      if (nextMovie === undefined) {
        this.fetchMoreRelatedMovies(this.playNextMovie);
        return;
      }
      // 存在すれば続きを再生リストに追加してplay
      this.pushMoviesQueue(nextMovie);
      this.playingMovie = nextMovie;
      this.playVideo();
    },
    playSpecifyMovie(movie){
      this.playingMovie = movie
      this.playVideo()
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
      this.playSpecifyMovie(this.moviesQueue[0])
    },
    onPlayerEnded() {
      this.playerFinish = true;
      this.playNextMovie();
    },
    
    addMovieQueue(obj) {
      this.$emit("add-movie-queue", obj);
    },
    pushMoviesQueue(movie) {
      this.$emit("push-movies-queue", movie);
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