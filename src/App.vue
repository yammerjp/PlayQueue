<template>
  <div id="app">
    <div id="player-box">
      <h1>Play Queue</h1>
      <div id="player"></div>
      <i class="material-icons tab-switch-bar">search</i>
      <i class="material-icons tab-switch-bar">play_arrow</i>
      <div class="tab-play-queue">
        <input type="text" id="movie-id-text"><input type="submit" value="送信" id="movie-id-text">
        <ul>
          <li v-for="item in movieQueue" :key="item.Id"> {{item.Id}} </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data(){
    return {
      movieQueue :[],
      movieQueueCt :1
    }
  },
  created(){
    this.movieQueue.push({
        Id:'OvWqYBBIYww'});
    this.movieQueue.push({
        Id:'mBlGOx4HdXM'});
    this.movieQueue.push({
        Id:'tTPOSNxCZF4'});
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
