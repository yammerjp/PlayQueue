<template>
<div>
  <div id="center-box">
    <div id="app">

      <h1><a href="/">Play Queue</a></h1>


      <!--動画再生タブ-->
      <div id="read-me">

        <h2>Play Queueとは？</h2>
        <p>Youtube動画を、連続再生するプレイヤーです。</p>
        <p>tl;dr ... 3タブ構成です。左[再生タブ]の関連動画と、右[検索タブ]の検索動画から、中央[プレイリスト]に動画を追加しましょう！自動で連続再生されます。</p>
        <h2>タブ構成</h2>
        <h3>1. <i class="material-icons">play_arrow</i>再生</h3>
        <p>
          <div>動画の再生/停止、関連動画をさがすことができます。</div>
          <div>「↓」ボタンを押すと関連動画をさらに表示します。</div>
          <div>再生したい動画をクリックして、プレイリストに追加しましょう。
            「今すぐ再生」「次に再生」「最後に再生」の3つで、追加されるプレイリスト内の場所が異なります。</div>
        </p>
        <h3>2. <i class="material-icons">playlist_play</i>プレイリスト</h3>
        <p>
          <div>プレイリストを編集、保存できます。再生順を並べ替えたり、動画を削除したりすることが可能です。</div>
          <div>プレイリストは上から下に順に再生されていきます。</div>
          (プレイリストに新しい動画を追加するときは他タブから行います。関連動画/検索動画から探し追加してください。)
        </p>
        <h4>2.1 プレイリスト終了後の動作</h4>
        <p>下のトグルボタンではプレイリストの末尾の動画が再生終了したときの動作を選べます。</p>
        <ul>
          <li><span class="underline">ループ:</span><br>
            ONにすると、プレイリスト一番上の動画を再生します。</li>
          <li><span class="underline">末尾の関連動画を自動再生する:</span><br>
            ONにすると、プレイリスト末尾の関連動画の中で一番上のものを再生します。
            (「ループ」がOFFのときのみ選べます。)</li>
          <li><span class="underline">新しい関連動画のみ:</span><br>
            ONにすると、「末尾の関連動画を自動再生する」で再生される動画が既にプレイリストにある時、その動画ではなく次に関連する動画を再生します。
            (「末尾の関連動画を自動再生する」がOFFのときのみ選べます。)</li>
        </ul>
        <h4>2.2 保存/開く</h4>
          <div>プレイリストを保存したり、保存したプレイリストを読み込むことができます。</div>
        <h5>2.2.1 現在のプレイリストを保存</h5>
          <p>
          <div>最も下にある「現在のプレイリストを保存」ボタンを押すと、現在のプレイリストに名前を付けて保存することができます。
            ボタンを押した後、「プレイリスト名」欄にプレイリストの名前を入力してください。
            存在しない名前のプレイリストは新規作成され、同じ名前のプレイリストは上書きされます。</div>
          </p>
        <h5>2.2.2 過去のプレイリストを開く</h5>
        <p>
          <div>「過去のプレイリストを開く」ボタンを押し、次に出てくる「保存したリスト」プルダウンメニューを開くと端末に保存されているPlayQueueのプレイリストが表示されます。
            一つ選択し「開く」ボタンを押すと当該プレイリストを読み込みます。</div>
          <div>保存されたプレイリストのリネーム、編集はできませんので、一度削除して再び保存してください。</div>
        </p>
        <h5>2.2.3 過去のプレイリストを削除</h5>
        <p>
            <div>「過去のプレイリストを削除」ボタンを押し、次に出てくる「保存したリスト」プルダウンメニューを開くと端末に保存されているPlayQueueのプレイリストが表示されます。
                一つ選択し「削除」ボタンを押すと当該プレイリストを削除します。このとき確認画面が表示されます。復元できませんので注意してください。</div>
        </p>
        <h3>3. <i class="material-icons">search</i>検索</h3>
        <p>
          <div>上部の検索バーに検索ワードを入力してEnterまたは下の「↓」ボタンを押すと、Youtube動画を検索できます。</div>
          <div>再生したい動画をクリックして、プレイリストに追加しましょう。
            「今すぐ再生」「次に再生」「最後に再生」の3つで、追加されるプレイリスト内の場所が異なります。</div>
        </p>
        <h2>作者</h2>
        GitHub:basd4g ( <a href="https://github.com/basd4g/">https://github.com/basd4g/</a> )
        <h2>更新履歴</h2>
        <p>2018/12/6 : 開発開始</p>
        <p>2018/12/18 : 公開</p>
        <p>2018/12/19 : UIの修正</p>
        <p>2019/1/25 : ループ機能、関連動画自動再生機能の追加</p>
        <p>2019/2/12 : readMeファイルの追加</p>
        <p>2019/6/9 : プレイリストへ動画を追加した時の挙動変更(動画を追加した旨のメッセージを表示します。
          また「今すぐ再生」を選択した場合は再生タブへ自動的に遷移します。)</p>  
        <p>2019/6/10 : Helpボタンの追加</p>
        <p>2019/6/14 : プレイリストへ動画を追加した旨のメッセージの表示位置を変更</p>
        <p>2019/6/14 : プレイリストを開く機能とプレイリストを削除する機能の分割</p>
        <p>2019/6/20 : 「現在のプレイリストを保存」ボタンが正常に機能しない問題を修正</p>
      </div>


    </div>
  </div>
</div>
</template>
<style>


body{
    text-align: center;
    background-color: rgb(230, 230, 230);
}
h1{
    font-family: 'Anton', sans-serif;
    font-size: 1.5em;
    color: #da5019;
    margin-top:0.5em;
    margin-bottom: 0.5em;
}



#center-box{
    display: inline-block;
    min-height: 100vh;
    background-color: rgb(255, 255, 255);
    box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
}
#player{
    /*youtube player 16:9固定 ↓*/
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /*youtube player 16:9固定 ↑*/
}

#player > .row{
    color:#8a8a8a;
    padding:1em;
    font-size: 1.3em;
}
#player > .row .search{
    color:#da5019;
}
#tab-bar{
    padding-top:5px;
    padding-bottom: 5px;
    user-select: none; /* Firefox */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
#player-box:before {
    /*youtube player 16:9固定 ↓*/
    content:"";
    display: block;
    padding-top: 56.25%; /* 高さと幅の比を16:9に固定。9/16*100=56.25 */
    /*youtube player 16:9固定 ↑*/
}
#player-box{
    /*youtube player 16:9固定 ↓*/
    position: relative;
    width: 100%;
    /*youtube player 16:9固定 ↑*/
}
.tab-queue{
    width: 98%;
    margin: auto;
    display: inline-block;
}
.tab-search{
    width: 98%;
    margin: auto;
    display: inline-block;
}
.selected-tab-bar{
    border-bottom: solid 2px #DA5019;
}
#center-box{
    width: 100%;
    max-width: 600px;
}
.intab-card-panel{
    padding:2px;
    margin:0px;
}
.tab-row{
    margin-bottom: 3px;
}
.intab-row {
    margin-bottom: 3px;
    width: 100%;
}

.movie-list{
    margin-bottom:0px;
}
.movie-list button{
    margin:5px;
}

.title{

    text-align:left;
    font-size: 1em;
}

#tab-player > .title{
    margin:0.25em 1em;
    font-style: bold;
}
.movie-list .title{
    width:100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    overflow: hidden;
    user-select: none; /* Firefox */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/

}
.movie-list .selected .title{
/*    text-overflow:clip;*/
    overflow-wrap: break-word;
    white-space: normal;
}
.description{
    margin:0;
    text-align:left;
    font-size:0.8em;
    color: rgb(71, 71, 71) ;
    
    width:100%;
    overflow-wrap: break-word;
}
#tab-player >.description{
    padding :0.25em 1em;
    
    box-sizing: border-box;
}
#tab-player .information{
    padding :0.25em;
}
.movie-list .description{
    width:100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    font-size:0.8em;
    color: rgb(71, 71, 71) ;
    user-select: none; /* Firefox */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
.movie-list .selected .description{
    overflow-wrap: break-word;
    white-space: normal;
}
.information{
    font-size:0.8em;
    color: rgb(71, 71, 71) ;
    text-align: right;
}

.col {
    margin-left: auto;
    margin-right: auto;
    padding: 0.25em;
}
.now-play-movie{
    border-style:solid;
    border-color: #DA5019;
    border-radius: 3px;
}
.now-move-movie{
    background-color:rgb(139, 139, 139);
}
.move-here{
    background-color:#F3C0AB;
}
.list-name{
    margin-top:2em;
    margin-bottom: 0.25em;
}
.next-play{
    text-align: left;
    margin-left:1em;
}
.settings{
    text-align: right;
    margin-right:1em;
}
.switch-caption{
    color: rgb(32, 32, 32);
}
.strikeout{
    text-decoration: line-through;
    color: rgb(114, 114, 114);
}
.width100{
    width: 100%;
}
/*.responsive-img{
    
}*/


.description .description-button{
    text-decoration: underline;
}
.full-description{
    white-space: pre-wrap;
}

.RW-list{
    margin-top:1em;    
}
.RW-button{
    padding-right: 1em;
    padding-left: 1em;
}
.modal-title{
    padding:0.5em;
}
.modal-background{
    position: fixed;
    top: 0px;
    right: 0px;
    width:100%;
    min-height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1;
    text-align: center;

    display: table-cell;
    vertical-align: middle;
}
.modal-window{
    position: fixed;

    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    
    width:auto;
    height:auto; 

    margin: auto;
    background-color: rgb(255,255,255);
    width:auto;
    
    z-index: 2;
    padding: 1em;
}

.LS-key{
    width:80%;
    display:inline-block;
    border-style:solid;
    border-radius: 1em;
    border-width: thin;
    margin: 0.2em;


}
select{
    display: block;
}

.read-me{
    padding:1em;
    font-size:0.8em;
}
#read-me-button{
    position:absolute;
    right: 0.5em;
    top:0.5em;
}
#read-me-button > a{
    color: rgb(71, 71, 71) ;
}
#pre-first-messege{
    position: static;
}
#first-messege{
    position: absolute;
    top: 52%;
    left:50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    
    width:100%;
    height:auto; 
    font-size: 1.6em;
    color:rgb(48, 48, 48);
    box-sizing: content-box;
    z-index: 5;
}
.displayNone{
    display:none;
}
.playlist-store-button{
    display:inline-block;
    margin-bottom:0.2em;
}


#read-me{
    text-align: left;
    padding: 1em;
}
#read-me h2{
    font-size: 1.3em;
    color: rgb(54, 54, 54);
    font-weight: bold;
/*    display: inline-block;
    border: solid;
    border: 10px,20px,30px,40px;*/
}
#read-me h3{
    font-size: 1.2em;
    color: rgb(54, 54, 54);
}
#read-me h4{
    font-size: 1.1em;
    color: rgb(54, 54, 54);
}
#read-me h5{
    font-size: 1.1em;
    color: rgb(54, 54, 54);
    text-decoration: underline;
}
h1 a{

    color: #da5019;

}
p{
    padding-left :0.5em;
}
li{
    padding: 0.2em;
}
.underline{
    text-decoration: underline;
}
</style>