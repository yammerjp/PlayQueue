<template>
<div>
  <div class="movie-list col s12 row" v-for="movie in movies" :key="movie.uniqueKey">
    <div class="card-panel grey lighten-5 z-depth-1 intab-card-panel">
        <div class="next-play" v-if="movie.uniqueKey===nextPlayUniqueKey">
          次に再生:
        </div>
      <div class="row valign-wrapper intab-row">
        <div
          class="width100"
          v-bind:class="{'selected':movie.uniqueKey===emphasizedMovieUniqueKey}"
          v-on:click="listMovieClicked(movie)"
        >
          <div class="col s3">
            <img v-bind:src="movie.thumbnail" alt class="responsive-img" />
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
        v-bind:class="{'displayNone':!(movie.uniqueKey===clickedMovieUniqueKey)}"
        v-on:click="listMovieClicked(movie)"
      >
        <button class="btn waves-effect waves-light" v-on:click="addMovieQueue('PLAY_NOW',movie)">
          <i class="material-icons">play_arrow</i>今すぐ再生
        </button>
        <button class="btn waves-effect waves-light" v-on:click="addMovieQueue('PLAY_NEXT',movie)">
          <i class="material-icons">add</i>次に再生
        </button>
        <button class="btn waves-effect waves-light" v-on:click="addMovieQueue('PLAY_LAST',movie)">
          <i class="material-icons">low_priority</i>最後に再生
        </button>
      </div>
    </div>
  </div></div>
</template>
<script>

export default {
  data:()=>{ return {
    clickedMovieUniqueKey: undefined
  }},
  props:[
    'movies',//tabSearch.mvList
    'emphasizedMovieUniqueKey',
    'nextPlayUniqueKey'
  ],
  methods:{
    listMovieClicked:function(movie){
      if (this.clickedMovieUniqueKey === movie.uniqueKey) {
        this.clickedMovieUniqueKey = undefined;
      } else {
        this.clickedMovieUniqueKey = movie.uniqueKey; //this.tabCommon.ListClickUniqueKey
      }
    },
    addMovieQueue:function(msg, movie){
      this.$emit('add-movie-queue',{message:msg, movie})
    }
  }
}
</script>
<style scoped>
.next-play {
  text-align: left;
  margin-left: 1em;
}
</style>