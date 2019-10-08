<template>
  <div>
    <div>プレイリスト</div>
    <div
      class="move-here"
      v-if="tabQueue.move.able && tabQueue.move.from!==0"
      @click="moveHere(-1)"
    >here</div>
    <template v-if="playerStart">
      <div
        class="movie-list col s12 row"
        v-for="(movie,index) in tabQueueMvList"
        :key="movie.key"
      >
        <div
          class="card-panel grey lighten-5 z-depth-1 intab-card-panel"
          :class="{'now-play-movie':movie.key===playingMovie.key}"
        >
          <div
            class="row valign-wrapper intab-row"
            :class="{'now-move-movie':movie===tabQueueMvList[tabQueue.move.from]}"
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
          v-if="tabQueue.move.able && index!==tabQueue.move.from && index!==tabQueue.move.from-1"
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
      :displayedMoviesProps="tabQueueMvList"
      @new-displayedMovies="updateTabQueueMvList"
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
      tabQueue: {
        move: {
          able: false, //movable
          from: -1 //moveFrom
        }
      },
      tabQueueMvList_: [emptyMovie],
      tQloop: false,
      tQautoPlayRelatedMovie: false,
      tQautoPlayNewRelatedMovie: false,
      listClickKey: ""
    };
  },
  watch: {
    tQloop: function(newVal, oldVal) {
      this.$emit("update-tQloop", newVal);
      if (newVal && !oldVal && this.playerStart) {
        this.manipulatePlayer({ message: "playRestart" });
      }
    },
    tQautoPlayRelatedMovie: function(newVal, oldVal) {
      this.$emit("update-tQautoPlayRelatedMovie", newVal);
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
    tabQueueMvList: {
      set: function(movies) {
        this.tabQueueMvList_ = movies;
        this.$emit("update-tabQueueMvList", movies);
      },
      get: function() {
        return this.tabQueueMvList_;
      }
    }
  },
  methods: {
    addMovieQueue({ message, movie }) {
      if (
        this.tabQueueMvList.length === 1 &&
        this.tabQueueMvList[0].Id === ""
      ) {
        this.tabQueueMvList = [];
      }
      let pushedMv = Object.assign({}, movie);
      pushedMv.key = uuidv4();
      console.log(pushedMv);
      let messageWord; //動画を再生リストへ追加したことを通知 2019/6/9 add
      const i = this.tabQueueMvList.findIndex(({ key }) => {
        return key === this.playingMovie.key;
      });
      switch (message) {
        case "PLAY_NOW":
          this.tabQueueMvList = insert2list(
            this.tabQueueMvList,
            i + 1,
            pushedMv
          );
          this.tabChange("TAB_PLAY"); //再生タブへ強制遷移 2019/6/9 add
          this.manipulatePlayer({
            message: "playSpecifyAddedMovieOfTabQueue",
            movie: pushedMv
          });
          messageWord = "挿入";
          break;
        case "PLAY_NEXT":
          this.tabQueueMvList = insert2list(
            this.tabQueueMvList,
            i + 1,
            pushedMv
          );
          this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
          messageWord = "挿入";
          break;
        case "PLAY_LAST":
          this.tabQueueMvList.push(pushedMv);
          this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
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
    changeMovieQueue({ message, movie, index }) {
      /*↑uniqueキーが一致するtabQueueMvListの配列番号 つまりmovieが存在するtabQueueMvList配列内の位置 */
      switch (message) {
        case "JUMP": //movieの位置に再生キューを移動して再生
          this.manipulatePlayer({
            message: "playSpecifyAddedMovieOfTabQueue",
            movie
          });
          this.tabChange("TAB_PLAY"); //再生タブへ強制遷移 2019/6/10 add
          break;
        case "DELETE": //movieを再生キューから削除
          this.tabQueueMvList.splice(index, 1); //削除
          break;
        case "MOVE": //movieの位置を移動して再生キュー内の順番を変更
          if (this.tabQueue.move.able) this.moveCancel();
          this.tabQueue.move.from = index;
          //削除前に、移動する動画の場所を保存しておく
          this.tabQueue.move.able = true;
          /*選択画面を挟んでから移動先が決定 */
          break;
      }
    },
    moveHere(index) {
      const movieFrom = this.tabQueueMvList[this.tabQueue.move.from];
      this.tabQueueMvList.splice(this.tabQueue.move.from, 1); //削除
      const offset = index > this.tabQueue.move.from ? 0 : 1;
      this.tabQueueMvList.splice(index + offset, 0, movieFrom); //予め保存していたデータをリストに挿入
      this.moveCancel();
      this.manipulatePlayer({ message: "playRestart" }); //もし最後尾に再生するものが増えていたら再生してくれる。
    },
    moveCancel() {
      this.tabQueue.move.able = false;
      this.tabQueue.move.from = -1;
    },
    pushTabQueueMvList(movie) {
      this.tabQueueMvList.push(movie);
    },
    updateTabQueueMvList(movies) {
      console.log("updateTabQueueMvList");
      console.log(movies);
      this.tabQueueMvList = movies;
    },
    playFirstMovie() {
      this.manipulatePlayer({
        message: "playSpecifyAddedMovieOfTabQueue",
        movie: this.tabQueueMvList[0]
      });
    },
    manipulatePlayer(obj) {
      this.$emit("manipulatePlayer", obj);
    },
    tabChange(tabName) {
      this.$emit("tab-change", tabName);
    },
    listMovieClicked(movie) {
      if (this.listClickKey === movie.key) {
        this.listClickKey = "";
      } else {
        this.listClickKey = movie.key;
      }
    }
  }
};
</script>