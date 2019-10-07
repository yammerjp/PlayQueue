<template>
  <div id="player-not-playing">
    <div id="pre-first-messege">
      <div class="row">
        <div class="col s4">
          <div>
            <i class="material-icons tab-switch-bar">arrow_upward</i>
          </div>
          <div>再生</div>
        </div>
        <div class="col s4">
          <div>
            <i class="material-icons tab-switch-bar">arrow_upward</i>
          </div>
          <div>プレイリスト</div>
        </div>
        <div class="col s4 search">
          <div>
            <i class="material-icons tab-switch-bar">arrow_upward</i>
          </div>
          <div>検索</div>
        </div>
      </div>
      <div id="first-messege">
        <div>ようこそPlay Queueへ</div>
        <div>検索から動画をみつけましょう</div>
        <div class="read-me">
          <a href="/readMe" target="_blank">使い方ガイドはこちら</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/*
#player-not-playing {
  /*youtube player 16:9固定 ↓
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*youtube player 16:9固定 ↑
}*/

#player-not-playing > .row {
  color: #8a8a8a;
  padding: 1em;
  font-size: 1.3em;
}
#player-not-playing > .row .search {
  color: #da5019;
}
/*
#player-not-playing:before {
  /*youtube player 16:9固定 ↓
  content: "";
  display: block;
  padding-top: 56.25%; /* 高さと幅の比を16:9に固定。9/16*100=56.25 
  /*youtube player 16:9固定 ↑
}*/
</style>