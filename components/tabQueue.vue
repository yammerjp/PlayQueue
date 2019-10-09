<template>
  <div>
    <div>プレイリスト</div>
    <div class="move-here" v-if="move.able && move.from!==0" @click="moveHere(-1)">here</div>
    <template v-if="playerStart">
      <div class="movie-list col s12 row" v-for="(movie,index) in moviesQueue" :key="movie.key">
        <div
          class="card-panel grey lighten-5 z-depth-1 intab-card-panel"
          :class="{'now-play-movie':movie.key===playingMovie.key}"
        >
          <div
            class="row valign-wrapper intab-row"
            :class="{'now-move-movie':movie===moviesQueue[move.from]}"
          >
            <div
              class="width100"
              :class="{'selected':movie.key===listClickKey}"
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
            v-if="movie.key===listClickKey"
            @click="listMovieClicked(movie)"
          >
            <!--クリックされている-->
            <button
              class="btn waves-effect waves-light"
              @click="changeMovieQueue({message:'JUMP',movie,index})"
            >
              <i class="material-icons">play_arrow</i>
              <template v-if="movie.key===playingMovie.key">最初から再生</template>
              <template v-else>今すぐ再生</template>
            </button>
            <button
              class="btn waves-effect waves-light"
              :class="{disabled:movie.key===playingMovie.key}"
              @click="movie.key!==playingMovie.key && changeMovieQueue({message:'DELETE',movie,index})"
            >
              <i class="material-icons">clear</i>リストから削除
            </button>
            <button
              class="btn waves-effect waves-light"
              :class="{disabled:movie.key===playingMovie.key}"
              @click="movie.key!==playingMovie.key && changeMovieQueue({message:'MOVE',movie,index})"
            >
              <i class="material-icons">format_line_spacing</i>移動
            </button>
          </div>
        </div>
        <div
          class="move-here"
          v-if="move.able && index!==move.from && index!==move.from-1"
          @click="moveHere(index)"
        >here</div>
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
        <span class="switch-caption">末尾の関連動画を自動再生する:</span>
        <label>
          Off
          <input type="checkbox" v-model="tQautoPlayRelatedMovie" />
          <span class="lever"></span>
          <span>On</span>
        </label>
      </div>
      <div class="switch">
        <span
          class="switch-caption"
          :class="{strikeout: isDisabledNewRelatedMovieToggle}"
        >新しい関連動画のみ:</span>
        <label>
          Off
          <input
            :disabled="isDisabledNewRelatedMovieToggle"
            type="checkbox"
            v-model="tQautoPlayNewRelatedMovie"
          />
          <span class="lever"></span>
          <span :class="{strikeout: isDisabledNewRelatedMovieToggle}">On</span>
        </label>
      </div>
    </div>
    <!--リストを保存、開く機能-->
    <saveList
      :displayedMoviesProps="moviesQueue"
      @new-displayedMovies="updateMoviesQueue"
      @move-cancel="moveCancel"
      @play-first-movie="playFirstMovie"
    />
  </div>
</template>
<script>
import emptyMovie from "@/assets/js/emptyMovie.js";
import saveList from "@/components/saveList.vue";
const uuidv4 = require("uuid/v4");
const iziToast = require("izitoast");

export default {
  components: {
    saveList
  },
  data: () => {
    return {
      move: {
        able: false,
        from: -1
      },
      moviesQueue_: [emptyMovie],
      atEndingQueue: "STOP", //STOP, PLAY_QUEUE_TOP, PLAY_RELATED_MOVIE, PLAY_NEW_RELATED_MOVIE
      tQloop: false,
      tQautoPlayRelatedMovie: false,
      tQautoPlayNewRelatedMovie: false,
      listClickKey: ""
    };
  },
  watch: {
    tQloop: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.tQautoPlayRelatedMovie = false;
        this.tQautoPlayNewRelatedMovie = false;
        if (this.playerStart) {
          this.manipulatePlayer({ message: "playRestart" });
        }
      }
      this.changedToggleAtEndingQueue();
    },
    tQautoPlayRelatedMovie: function(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.tQloop = false;
        if (this.playerStart) {
          this.manipulatePlayer({ message: "playRestart" });
        }
      } else {
        this.tQautoPlayNewRelatedMovie = false;
      }

      this.changedToggleAtEndingQueue();
    },
    tQautoPlayNewRelatedMovie: function(newVal, oldVal) {
      this.changedToggleAtEndingQueue();
      if (newVal && !oldVal && this.playerStart) {
        this.manipulatePlayer({ message: "playRestart" });
      }
    }
  },
  props: {
    playerStart: Boolean,
    playingMovie: Object
  },
  computed: {
    moviesQueue: {
      set: function(movies) {
        this.moviesQueue_ = movies;
        this.$emit("update-moviesQueue", movies);
      },
      get: function() {
        return this.moviesQueue_;
      }
    },
    isDisabledNewRelatedMovieToggle(){
      return this.atEndingQueue==='STOP'|| this.atEndingQueue=='PLAY_QUEUE_TOP'
    }
  },
  methods: {
    addMoviesQueue({ message, movie: mv }) {
      if (this.moviesQueue.length === 1 && this.moviesQueue[0].Id === "") {
        this.moviesQueue = [];
      }
      let movie = Object.assign({}, mv);
      movie.key = uuidv4();

      let messageWord;
      const i = this.moviesQueue.findIndex(({ key }) => {
        return key === this.playingMovie.key;
      });
      switch (message) {
        case "PLAY_NOW":
          this.moviesQueue = insert2list(this.moviesQueue, i + 1, movie);
          this.tabChange("TAB_PLAY"); //再生タブへ強制遷移
          this.manipulatePlayer({
            message: "playSpecifyMovie",
            movie
          });
          messageWord = "挿入";
          break;
        case "PLAY_NEXT":
          this.moviesQueue = insert2list(this.moviesQueue, i + 1, movie);
          this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "挿入";
          break;
        case "PLAY_LAST":
          this.moviesQueue.push(movie);
          this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "追加";
          break;
      }
      iziToast.show({
        position: "topRight",
        title: "Add movie to the playlist",
        message: `再生リストに動画「${movie.title}」を${messageWord}しました。`
      });

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
    pushMoviesQueue(movie) {
      this.moviesQueue.push(movie);
    },
    changeMovieQueue({ message, movie, index }) {
      /*↑uniqueキーが一致するmoviesQueueの配列番号 つまりmovieが存在するmoviesQueue配列内の位置 */
      switch (message) {
        case "JUMP": //movieの位置に再生キューを移動して再生
          this.manipulatePlayer({
            message: "playSpecifyMovie",
            movie
          });
          this.tabChange("TAB_PLAY"); //再生タブへ強制遷移 2019/6/10 add
          break;
        case "DELETE": //movieを再生キューから削除
          this.moviesQueue.splice(index, 1); //削除
          break;
        case "MOVE": //movieの位置を移動して再生キュー内の順番を変更
          if (this.move.able) this.moveCancel();
          this.move.from = index;
          //削除前に、移動する動画の場所を保存しておく
          this.move.able = true;
          /*選択画面を挟んでから移動先が決定 */
          break;
      }
    },
    moveHere(index) {
      const movieFrom = this.moviesQueue[this.move.from];
      this.moviesQueue.splice(this.move.from, 1); //削除
      const offset = index > this.move.from ? 0 : 1;
      this.moviesQueue.splice(index + offset, 0, movieFrom); //予め保存していたデータをリストに挿入
      this.moveCancel();
      this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
    },
    moveCancel() {
      this.move.able = false;
      this.move.from = -1;
    },
    changedToggleAtEndingQueue() {
      const retNewAtEndingQueue = () => {
        if (this.tQloop) {
          return "PLAY_QUEUE_TOP";
        }
        if (this.tQautoPlayRelatedMovie) {
          if (this.tQautoPlayNewRelatedMovie) {
            return "PLAY_NEW_RELATED_MOVIE";
          }
          return "PLAY_RELATED_MOVIE";
        }
        return "STOP";
      };

      this.atEndingQueue = retNewAtEndingQueue();
      this.$emit("update-at-ending-queue", this.atEndingQueue);
    },
    updateMoviesQueue(movies) {
      this.moviesQueue = movies;
    },

    listMovieClicked(movie) {
      if (this.listClickKey === movie.key) {
        this.listClickKey = "";
      } else {
        this.listClickKey = movie.key;
      }
    },
    playFirstMovie() {
      this.manipulatePlayer({
        message: "playSpecifyMovie",
        movie: this.moviesQueue[0]
      });
    },
    manipulatePlayer(obj) {
      this.$emit("manipulatePlayer", obj);
    },
    tabChange(tabName) {
      this.$emit("tab-change", tabName);
    }
  }
};
</script>