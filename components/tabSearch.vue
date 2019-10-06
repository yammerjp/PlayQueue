<template>
  <div class="tab-search">
    <form @submit.prevent="searchWordSubmitted">
      <input type="text" v-model="tabSearch.word" placeholder="search word" class="searchWordInput" />
      <!--        <button v-on:click="searchWordSubmitted">search</button>-->
    </form>
    <movieList
      :movies="tabSearch.mvList"
      :emphasizedMovieUniqueKey="emphasizedMovieUniqueKey"
      @add-movie-queue="addMovieQueue"
    />
    <button v-on:click="searchWordSubmittedMore" class="btn waves-effect waves-light">
      <i class="material-icons">keyboard_arrow_down</i>
    </button>
  </div>
</template>
<script>
import fetchYoutubeDataV3 from '@/assets/js/fetch-youtube-data-v3.js'
import movieList from '@/components/movieList.vue'

export default {
  components: {
    movieList
  },
  data: () => {
    return {
      tabSearch: {
        mvList: [], // movieSearchList
        nextPageToken: "", //nextPageToken:
        preWord: "q=",
        word: "", // searchWord
        wordSubmit: ""
      }
    };
  },
  props: [
    'emphasizedMovieUniqueKey',
  ],
  methods: {
    searchWordSubmitted() {
      if (this.tabSearch.word == "") return 0;

      let active_element = document.activeElement; // フォーカスを外す
      if (active_element) {
        active_element.blur();
      }
      fetchYoutubeDataV3.getMovieList(
        this.tabSearch,
        true,
        this.tabSearch.word
      );
    },
    searchWordSubmittedMore() {
      if (this.tabSearch.wordSubmit == "") {
        if (this.tabSearch.word != "") {
          //もし未検索でmoreボタンを押して検索バーに文字があったら、その内容で検索
          this.searchWordSubmitted();
        }
        return 0;
        //ちなみに何も入力せずにmoreボタンを押していたら無視
      }

      fetchYoutubeDataV3.getMovieList(this.tabSearch, false);
    },
    addMovieQueue(obj){
      this.$emit('add-movie-queue',obj)
    }
  }
};
</script>