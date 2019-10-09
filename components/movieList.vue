<template>
  <div>
    <div class="movie-list col s12 row" v-for="movie in movies" :key="movie.key">
      <div class="card-panel grey lighten-5 z-depth-1 intab-card-panel">
        <div class="next-play" v-if="movie.key===nextPlayKey">次に再生:</div>
        <div class="row valign-wrapper intab-row">
          <div
            class="width100"
            :class="{'selected':movie.key===emphasizedMovieKey}"
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
          v-if="movie.key===clickedMovieKey"
          @click="listMovieClicked(movie)"
        >
          <button class="btn waves-effect waves-light" @click="addMoviesQueue({message:'PLAY_NOW',movie})">
            <i class="material-icons">play_arrow</i>今すぐ再生
          </button>
          <button class="btn waves-effect waves-light" @click="addMoviesQueue({message:'PLAY_NEXT',movie})">
            <i class="material-icons">add</i>次に再生
          </button>
          <button class="btn waves-effect waves-light" @click="addMoviesQueue({message:'PLAY_LAST',movie})">
            <i class="material-icons">low_priority</i>最後に再生
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      clickedMovieKey: undefined
    };
  },
  props: {
    movies: Array,
    emphasizedMovieKey: String,
    nextPlayKey: String
  },
  methods: {
    listMovieClicked(movie) {
      if (this.clickedMovieKey === movie.key) {
        this.clickedMovieKey = undefined;
      } else {
        this.clickedMovieKey = movie.key; 
      }
    },
    addMoviesQueue({ message, movie }) {
      this.$emit("add-movies-queue", { message, movie });
    }
  }
};
</script>
<style scoped>
.next-play {
  text-align: left;
  margin-left: 1em;
}
</style>