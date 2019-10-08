<template>
  <div class="row RW-list">
    <a
      class="waves-effect waves-light btn RW-button playlist-store-button"
      @click="openListStorageWindow('INPUT')"
    >
      <i class="material-icons tab-switch-bar">save</i>現在のプレイリストを保存
    </a>
    <a
      class="waves-effect waves-light btn RW-button playlist-store-button"
      @click="openListStorageWindow('LIST_OPEN')"
    >
      <i class="material-icons tab-switch-bar">folder_open</i>過去のプレイリストを開く
    </a>
    <a
      class="waves-effect waves-light btn RW-button playlist-store-button"
      @click="openListStorageWindow('LIST_DELETE')"
    >
      <i class="material-icons tab-switch-bar">folder_open</i>過去のプレイリストを削除
    </a>
    <div
      class="modal-background"
      v-if="inputWindow || listWindow"
      @click="openListStorageWindow('CLOSE')"
    ></div>

    <div class="modal-window" v-if="inputWindow">
      <input type="text" v-model="inputKey" placeholder="プレイリスト名" />
      <button class="waves-effect waves-light btn RW-button" @click="addListStorage(inputKey)">保存</button>
      <!--          <div :class='{"displayNone":listNameConflict!=true}'>既に存在するリスト名です</div>-->
    </div>

    <div class="modal-window" v-if="listWindow">
      <select v-model="inputKey" name="local-storage-key-view">
        <option value disabled selected>保存したリスト</option>
        <option v-for="(item) in list" :key="item" :value="item">{{item}}</option>
      </select>
      <button
        class="waves-effect waves-light btn RW-button"
        id="not-list-delete-window"
        v-if="!listDeleteWindow"
        @click="openListStorage(inputKey)"
      >開く</button>
      <button
        class="waves-effect waves-light btn RW-button"
        id="list-delete-window"
        v-else
        @click="deleteListStorage(inputKey)"
      >削除する</button>
    </div>
  </div>
</template>
<script>
import localStorageInterface from "@/assets/js/localStorageInterface.js";

export default {
  data: () => {
    return {
      list: [],
      inputKey: "",
      listNameConflict: false,
      listWindow: false,
      listDeleteWindow: false,
      inputWindow: false
    };
  },
  props: {
    displayedMoviesProps: Array
  },
  computed: {
    displayedMovies: {
      get: function() {
        return this.displayedMoviesProps;
      },
      set: function(movies) {
        this.$emit("new-displayedMovies", movies);
      }
    }
  },
  methods: {
    addListStorage(localStorageKey) {
      if (localStorageInterface.show().indexOf(localStorageKey) >= 0) {
        //                this.listNameConflict=true;
        //既に存在する リスト名
        if (
          !window.confirm(`${localStorageKey} を上書きします。よろしいですか？`)
        )
          return;
      }
      if (localStorageKey === "") return;
      localStorageInterface.store(localStorageKey, this.displayedMovies);
      this.openListStorageWindow("CLOSE");
      return;
    },
    openListStorage(localStorageKey) {
      if (localStorageKey == "") {
        return;
      }
      this.openListStorageWindow("CLOSE");
      this.$emit("move-cancel");
      this.displayedMovies = localStorageInterface.get(localStorageKey);
      this.$emit("play-first-movie");
    },
    deleteListStorage(localStorageKey) {
      if (localStorageKey == "") {
        return;
      }
      if (window.confirm(`${localStorageKey} を削除します。よろしいですか？`)) {
        localStorageInterface.delete(localStorageKey);
        this.list = localStorageInterface.show();
        this.openListStorageWindow("CLOSE");
      }
    },
    openListStorageWindow(window) {
      //selectLS
      //playerStart==falseに非対応
      switch (window) {
        case "INPUT":
          this.inputKey = "";
          this.listNameConflict = false;
          this.inputWindow = true;
          this.listWindow = false;
          break;
        case "LIST_DELETE":
          this.listDeleteWindow = true;
        case "LIST_OPEN":
          this.inputKey = "";
          this.inputWindow = false;
          this.listWindow = true;
          this.list = localStorageInterface.show();
          break;
        case "CLOSE":
          this.inputWindow = false;
          this.listWindow = false;
          this.listDeleteWindow = false;
          break;
      }
    }
  }
};
</script>
<style scoped>
.modal-title {
  padding: 0.5em;
}
.modal-background {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  text-align: center;

  display: table-cell;
  vertical-align: middle;
}
.modal-window {
  position: fixed;

  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  width: auto;
  height: auto;

  margin: auto;
  background-color: rgb(255, 255, 255);
  width: auto;

  z-index: 2;
  padding: 1em;
}

/*
.LS-key {
  width: 80%;
  display: inline-block;
  border-style: solid;
  border-radius: 1em;
  border-width: thin;
  margin: 0.2em;
}*/
.playlist-store-button {
  display: inline-block;
  margin-bottom: 0.2em;
}

.RW-list {
  margin-top: 1em;
}
.RW-button {
  padding-right: 1em;
  padding-left: 1em;
}

select {
  display: block;
}
</style>