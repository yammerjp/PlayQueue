<template>
<div>
    <div id="center-box">
<div id="app">
  
    <h1>Play Queue</h1>
    <!--タブ選択バー-->
    <div id="tab-bar" class="row tab-row">
      <div class="col s12">
          <div class="tab col s4" v-on:click='tabChange(0)' v-bind:class="{'selected-tab-bar': tabCommon.selectedTab==0}">
              <i class="material-icons tab-switch-bar">play_arrow</i>
          </div>
        <div class="tab col s4" v-on:click='tabChange(1)' v-bind:class="{'selected-tab-bar': tabCommon.selectedTab==1}">
          <i class="material-icons tab-switch-bar">playlist_play</i>
        </div>
        <div class="tab col s4" v-on:click='tabChange(2)' v-bind:class="{'selected-tab-bar': tabCommon.selectedTab==2}">
          <i class="material-icons tab-switch-bar">search</i>
        </div>
      </div>
    </div>
    <!--動画再生タブ-->    
    <div id="tab-player" v-bind:class="{'displayNone':tabCommon.selectedTab!=0}">
        <div id="pre-first-messege" v-bind:class='{"displayNone":tabCommon.playerStart==true}'><div id="first-messege">
            <div>ようこそPlay Queueへ</div>
            <div>検索から動画をみつけましょう</div>
            <div class="read-me"><a href="readMe.html"  target="_blank">使い方ガイドはこちら</a></div>
          </div></div>
        <div id='player-box'>
          <div id="player">
              <div class="row">
                  <div class="col s4">
                      <div><i class="material-icons tab-switch-bar">arrow_upward</i></div>
                      <div>再生</div>
                  </div>
                  <div class="col s4">
                      <div><i class="material-icons tab-switch-bar">arrow_upward</i></div>
                      <div>プレイリスト</div>
                  </div>
                  <div class="col s4 search">
                      <div><i class="material-icons tab-switch-bar">arrow_upward</i></div>
                      <div>検索</div>
                  </div>
              </div>
          </div>
          
        </div>
        <div class="title">{{tabQueue.mvList[tabQueue.mvListCt].title}}</div>
          <div class="description">
            <span class='short-description' v-bind:class='{"displayNone":tabPlay.fullDescription==true}'>
              {{tabQueue.mvList[tabQueue.mvListCt].description210}}
              <span
                class='description-button'
                v-bind:class='{"displayNone":tabQueue.mvList[tabQueue.mvListCt].description210==tabQueue.mvList[tabQueue.mvListCt].description}'
                v-on:click='tabPlay.fullDescription=true' >
                  [全文表示&gt;&gt;]
                </span>
            </span>
            <span class='full-description' v-bind:class='{"displayNone":tabPlay.fullDescription==false}'>{{tabQueue.mvList[tabQueue.mvListCt].description}}<span class='description-button' v-on:click='tabPlay.fullDescription=false'>[隠す&lt;&lt;]</span>
            </span>
          </div>
        <div class="information" v-bind:class='{"displayNone":tabCommon.playerStart!=true}'>
          <span class="publishedAt">{{tabQueue.mvList[tabQueue.mvListCt].publishedAt}}投稿 /</span>
          <span class="duration"> 再生時間:{{tabQueue.mvList[tabQueue.mvListCt].duration}} /</span>
          <span class="viewCount"> 再生回数:{{tabQueue.mvList[tabQueue.mvListCt].viewCount}}回/</span>
          <span class="channelTitle"> Channel: {{tabQueue.mvList[tabQueue.mvListCt].channelTitle}} </span>
        </div>
        
        <div class='list-name' v-bind:class='{"displayNone":tabCommon.playerStart!=true}'>関連動画</div>
        <div class="movie-list col s12 row" v-for="item in tabPlay.mvList" :key="item.uniqueKey">
            <div class="card-panel grey lighten-5 z-depth-1 intab-card-panel">
              <div class='next-play'
               v-bind:class="{'displayNone':!(tQloop==false && 
                                              tQautoPlayRelatedMovie==true &&
                                              tabQueue.mvListCt + 1 >=tabQueue.mvList.length &&
                                              item==tabPlay.mvList[0]
                                              )}">次に再生:</div>
              <div class="row valign-wrapper intab-row">
                <div
                 class="width100"
                 v-bind:class="{'selected':item.uniqueKey==tabCommon.ListClickUniqueKey}"
                 v-on:click='listMovieClicked(item)' >
                  <div class="col s3">
                    <img v-bind:src="item.thumbnail" alt="" class="responsive-img">
                  </div>
                  <div class="col s9">
                    <span class="black-text">
                        <div class="title">{{item.title}}</div>
                        <div class="description">{{item.description210}}</div>
                        <div class="information">{{item.publishedAt}}投稿</div>
                    </span>
                  </div>
                </div>
              </div>
              <div  class="selected-movie-s12" 
               v-bind:class="{'displayNone':!(item.uniqueKey==tabCommon.ListClickUniqueKey)}" 
               v-on:click='listMovieClicked(item)'>
                <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_NOW',item)">
                  <i class="material-icons">play_arrow</i>今すぐ再生
                </button>
                <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_NEXT',item)">
                  <i class="material-icons">add</i>次に再生
                </button>
                <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_LAST',item)">
                  <i class="material-icons">low_priority</i>最後に再生
                </button>
              </div>
            </div>
          </div>
    
          <button
           v-on:click="relatedMovieMore"
           class="btn waves-effect waves-light"
           v-bind:class="{'displayNone':tabCommon.playerStart==false}">
            <i class="material-icons">keyboard_arrow_down</i>
          </button>
    </div>

    <!--プレイリストタブ-->    
    <div class="tab-queue" v-bind:class="{'displayNone':tabCommon.selectedTab!=1}">
      <div>プレイリスト</div>
      <div class='move-here' v-bind:class="{'displayNone':tabQueue.move.able==false}" v-on:click='moveHere(0)'>here</div>
      <div 
       class="movie-list col s12 row"
       v-bind:class="{'displayNone':tabCommon.playerStart==false}"
       v-for="item in tabQueue.mvList"
       :key="item.uniqueKey">
        <div
         class="card-panel grey lighten-5 z-depth-1 intab-card-panel"
         v-bind:class='{"now-play-movie":item.uniqueKey==tabQueue.mvList[tabQueue.mvListCt].uniqueKey}'>
          <div 
           class="row valign-wrapper intab-row"
           v-bind:class='{"now-move-movie":item==tabQueue.mvList[tabQueue.move.from]}'>
            <div
             class="width100"
             v-bind:class="{'selected':item.uniqueKey==tabCommon.ListClickUniqueKey}"
             v-on:click='listMovieClicked(item)'>
              <div class="col s3">
                <img v-bind:src="item.thumbnail" alt="" class="responsive-img">
              </div>
              <div class="col s9">
                <span class="black-text">
                    <div class="title">{{item.title}}</div>
                    <div class="description">{{item.description210}}</div>
                    <div class="information">{{item.publishedAt}}投稿</div>
                </span>
              </div>
            </div>
          </div>
          <div  class="selected-movie-s12" 
           v-bind:class="{'displayNone':!(item.uniqueKey==tabCommon.ListClickUniqueKey)}" 
           v-on:click='listMovieClicked(item)'>
           <!--クリックされている∧再生中でない⇒表示-->
           <div v-bind:class="{'displayNone':item==tabQueue.mvList[tabQueue.mvListCt] }">
              <button class="btn waves-effect waves-light " v-on:click="changeMovieQueue('JUMP',item)">
                <i class="material-icons">play_arrow</i>今すぐ再生
              </button>
              <button class="btn waves-effect waves-light " v-on:click="changeMovieQueue('DELETE',item)">
                <i class="material-icons">clear</i>リストから削除
              </button>
              <button class="btn waves-effect waves-light " v-on:click="changeMovieQueue('MOVE',item)">
                <i class="material-icons">format_line_spacing</i>移動
              </button>
            </div>
            <div v-bind:class="{'displayNone':item!=tabQueue.mvList[tabQueue.mvListCt]}">
                <button class="btn waves-effect waves-light"  v-on:click="changeMovieQueue('JUMP',item)">
                  <i class="material-icons">play_arrow</i>最初から再生
                </button>
                <button class="btn waves-effect waves-light disabled">
                  <i class="material-icons">clear</i>リストから削除
                </button>
                <button class="btn waves-effect waves-light disabled">
                  <i class="material-icons">format_line_spacing</i>移動
                </button>
            </div>
          </div>  
        </div>
        <div class='move-here' v-bind:class="{'displayNone':tabQueue.move.able==false}" v-on:click='moveHere(item)'>here</div>
      </div>
      <div class="settings">
          <div class="switch">
              <span class="switch-caption">ループ:</span>  
              <label>
                Off
                <input type="checkbox" v-model="tQloop">
                <span class="lever"></span>
                On
              </label>
          </div>
          <div class="switch" v-bind:class="{'displayNone':tQloop==true}">
              <span class="switch-caption">末尾の関連動画を自動再生する:</span> 
              <label>
                Off
                <input type="checkbox" v-model="tQautoPlayRelatedMovie">
                <span class="lever"></span>
                On
              </label>
          </div>
          <div class="switch" v-bind:class="{'displayNone':tQloop==false}">
              <span class='switch-caption strikeout'>末尾の関連動画を自動再生する:</span>  
              <label>
                Off
                <input disabled type="checkbox" v-model="tQautoPlayRelatedMovie">
                <span class="lever"></span>
                <span class="strikeout">On</span>
              </label>
          </div>

          <div class="switch" v-bind:class="{'displayNone':tQautoPlayRelatedMovie==false||tQloop==true}">
            <span class="switch-caption">新しい関連動画のみ:</span> 
            <label>
              Off
              <input type="checkbox" v-model="tQautoPlayNewRelatedMovie">
              <span class="lever"></span>
              On
            </label>
        </div>
        <div class="switch" v-bind:class="{'displayNone':tQautoPlayRelatedMovie==true&&tQloop==false}">
            <span class='switch-caption strikeout'>新しい関連動画のみ:</span>  
            <label>
              Off
              <input disabled type="checkbox" v-model="tQautoPlayNewRelatedMovie">
              <span class="lever"></span>
              <span class="strikeout">On</span>
            </label>
        </div>
          
            
      </div>
      <!--リストを保存、開く機能-->
      <div class='row RW-list'>
        <a class="waves-effect waves-light btn RW-button playlist-store-button" v-on:click='openListStorageWindow("INPUT")'><i class="material-icons tab-switch-bar">save</i>現在のプレイリストを保存</a>
        <a class="waves-effect waves-light btn RW-button playlist-store-button" v-on:click='openListStorageWindow("LIST_OPEN")'><i class="material-icons tab-switch-bar">folder_open</i>過去のプレイリストを開く</a>
        <a class="waves-effect waves-light btn RW-button playlist-store-button" v-on:click='openListStorageWindow("LIST_DELETE")'><i class="material-icons tab-switch-bar">folder_open</i>過去のプレイリストを削除</a>
        <div class="modal-background" v-bind:class='{"displayNone":tabQueue.LSkey.inputWindow!=true && tabQueue.LSkey.listWindow!=true}' v-on:click='openListStorageWindow("CLOSE")'>
        </div>
        
        <div class='modal-window'  v-bind:class='{"displayNone":tabQueue.LSkey.inputWindow!=true}'>
            <input type="text" v-model="tabQueue.LSkey.inputKey" placeholder="プレイリスト名">
          <button class="waves-effect waves-light btn RW-button" v-on:click="addListStorage(tabQueue.LSkey.inputKey)">保存</button>
<!--          <div v-bind:class='{"displayNone":tabQueue.LSkey.listNameConflict!=true}'>既に存在するリスト名です</div>-->
        </div>

        <div class='modal-window'  v-bind:class='{"displayNone":tabQueue.LSkey.listWindow!=true}'>
          <select v-model='tabQueue.LSkey.inputKey' name='LSkey-view'>
            <option value="" disabled selected>保存したリスト</option>
            <option
              v-for="(item,index) in tabQueue.LSkey.list"
              :key='item'
              v-bind:value="item">{{item}}</option>
          </select>
          <button class="waves-effect waves-light btn RW-button" v-bind:class='{"displayNone":tabQueue.LSkey.listDeleteWindow}' v-on:click='openListStorage(tabQueue.LSkey.inputKey)'>開く</button>
          <button class="waves-effect waves-light btn RW-button" v-bind:class='{"displayNone":!tabQueue.LSkey.listDeleteWindow}' v-on:click='deleteListStorage(tabQueue.LSkey.inputKey)'>削除する</button>
        </div>
      </div>
    </div>

    <!--検索リストタブ-->    
    <div class="tab-search" v-bind:class="{'displayNone':tabCommon.selectedTab!=2}">
      <form @submit.prevent="searchWordSubmitted">
        <input type="text" v-model="tabSearch.word" placeholder="search word" class="searchWordInput">
<!--        <button v-on:click="searchWordSubmitted">search</button>-->
      </form>

      <div class="movie-list col s12 row" v-for="item in tabSearch.mvList" :key="item.uniqueKey">
        <div class="card-panel grey lighten-5 z-depth-1 intab-card-panel">
          <div class="row valign-wrapper intab-row">
            <div
             class="width100"
             v-bind:class="{'selected':item.uniqueKey==tabCommon.ListClickUniqueKey}"
             v-on:click='listMovieClicked(item)'>
              <div class="col s3">
                <img v-bind:src="item.thumbnail" alt="" class="responsive-img">
              </div>
              <div class="col s9">
                <span class="black-text">
                    <div class="title">{{item.title}}</div>
                    <div class="description">{{item.description210}}</div>
                    <div class="information">{{item.publishedAt}}投稿</div>
                </span>
              </div>
            </div>
          </div>
          <div  class="selected-movie-s12" 
           v-bind:class="{'displayNone':!(item.uniqueKey==tabCommon.ListClickUniqueKey)}" 
           v-on:click='listMovieClicked(item)'>
            <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_NOW',item)">
              <i class="material-icons">play_arrow</i>今すぐ再生
            </button>
            <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_NEXT',item)">
              <i class="material-icons">add</i>次に再生
            </button>
            <button class="btn waves-effect waves-light " v-on:click="addMovieQueue('PLAY_LAST',item)">
              <i class="material-icons">low_priority</i>最後に再生
            </button>
          </div>
        </div>
      </div>

      <button v-on:click="searchWordSubmittedMore" class="btn waves-effect waves-light">
        <i class="material-icons">keyboard_arrow_down</i>
      </button>
    </div>
  </div>
</div>
<div id="read-me-button"><a href="readMe.html"  target="_blank"><i class="material-icons">help</i></a></div>
</div>
</template>

<script>
const axios = require('axios');

const TAB_PLAYER = 0;
const TAB_QUEUE = 1;
const TAB_SEARCH = 2;
const SEARCHED = 0;
const RELATED = 1;
//const YoutubeKey = "AIzaSyAXVeNZpwqKoLvjbUaGj2Gug8IsZCm95vo";
const YoutubeKey = "AIzaSyANKSN8GKCbogYzLXqG4f75lwqwljA3RCU";
let player;

export default {
    data: ()=>{ return{
        tabQueue: {
            mvList: [//movieQueue
                {
                    Id: "",
                    description210: "",
                    thumbnail: "",
                    title: "",
                    uniqueKey: "",
                    publishedAt:"",
                    description: '',
                    duration: '',
                    viewCount: '',
                    channelTitle: '',
                } ],
            mvListCt: 0,//movieQueueCt
            move: {
                able: false,//movable
                from: -1,//moveFrom
            },
            LSkey:{
                list:[],
                inputKey:'',
                listNameConflict:false,
                listWindow:false,
                listDeleteWindow:false,
                inputWindow:false,
            },
        },
        tabPlay: {
            mvList: [],
            nextPageToken: '',
            preWord: 'relatedToVideoId=',
            wordSubmit: '',// 
            fullDescription: false,
            
        },
        tabSearch: {
            mvList: [],// movieSearchList
            nextPageToken: '',//nextPageToken:
            preWord: 'q=',
            word: '',// searchWord
            wordSubmit: '',
        },
        tabCommon: {
            ListClickUniqueKey: '',//ListClickUniqueKey
            selectedTab: 0,// selectedTab
            playerFinish :true,//playerStop
            playerStart:false,
        },
        tQloop:false,
        tQautoPlayRelatedMovie:false,
        tQautoPlayNewRelatedMovie:false,
    }},
    watch: {
        tQloop: function(newVal, oldVal) {
                if( newVal==true
                    &&oldVal==false
                    &&this.tabCommon.playerStart==true ){
                        playRestart();
                    }
        },
        tQautoPlayRelatedMovie: function(newVal, oldVal) {

                if( newVal==true
                    &&oldVal==false
                    &&this.tabCommon.playerStart==true ){
                        playRestart();
                    }
        }
    },
/*mounted(){
  },*/
    methods: {
        addMovieQueue: function (msg, movie) {

            const date = new Date();
            let pushedMv =Object.assign({}, movie);
            pushedMv.uniqueKey = `${date.getTime()}#added`;
            let messageWord; //動画を再生リストへ追加したことを通知 2019/6/9 add
            switch (msg) {
                case "PLAY_NOW":
                    this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, pushedMv);
                    playNextMovie();
                    this.tabCommon.selectedTab = 0;//再生タブへ強制遷移 2019/6/9 add
                    messageWord = "挿入";
                    break;
                case "PLAY_NEXT":
                    this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, pushedMv);
                    playRestart();//もし最後尾に再生するものが増えていたら再生してくれる。
                    messageWord = "挿入";
                    break;
                case "PLAY_LAST":
                    this.tabQueue.mvList.push(pushedMv);
                    playRestart();//もし最後尾に再生するものが増えていたら再生してくれる。
                    messageWord = "追加";
                    break;

            }
            iziToast.show({
                position: 'topRight',
                title: 'Add movie to the playlist',
                message: '再生リストに動画「' + pushedMv.title + '」を' + messageWord +'しました。',
            }); //動画を再生リストへ追加したことを通知 2019/6/9 add
        },
        changeMovieQueue(msg, item) {
            const itemCt = this.tabQueue.mvList.findIndex(({ uniqueKey }) => uniqueKey === item.uniqueKey);
            /*↑uniqueキーが一致するtabQueue.mvListの配列番号 つまりitemが存在するtabQueue.mvList配列内の位置 */
            switch (msg) {
                case "JUMP"://itemの位置に再生キューを移動して再生
                    this.tabQueue.mvListCt = itemCt - 1;
                    playNextMovie();
                    this.tabCommon.selectedTab = 0;//再生タブへ強制遷移 2019/6/10 add
                    break;
                case 'DELETE'://itemを再生キューから削除
                    this.tabQueue.mvList.splice(itemCt, 1);//削除
                    if (this.tabQueue.mvListCt > itemCt)//削除に合わせてtabQueue.mvListCtも現在再生しているものを指すように適切に変更
                        this.tabQueue.mvListCt--;
                    break;

                case 'MOVE'://itemの位置を移動して再生キュー内の順番を変更
                    if(this.tabQueue.move.able == true)
                        this.moveCancel();
                    this.tabQueue.move.from = itemCt;
                    //削除前に、移動する動画の場所を保存しておく
                    this.tabQueue.move.able = true;
                    /*選択画面を挟んでから移動先が決定 */
                    break;
            }
        },
        moveHere(item) {
            const itemFrom=this.tabQueue.mvList[this.tabQueue.move.from];
            if(itemFrom==item){//同じ場所に変更しろと言われたらキャンセル
                this.moveCancel();
                return 0;
            }
            this.tabQueue.mvList.splice(this.tabQueue.move.from, 1);//削除
            if (this.tabQueue.mvListCt > this.tabQueue.move.from)//削除に合わせてtabQueue.mvListCtも現在再生しているものを指すように適切に変更
                this.tabQueue.mvListCt--;

            let itemCt;
            if (item === 0) {
                itemCt = -1;//一番上に挿入する場合
            } else {
                itemCt = this.tabQueue.mvList.findIndex(({ uniqueKey }) => uniqueKey === item.uniqueKey);
            }
            this.tabQueue.mvList.splice(itemCt + 1, 0, itemFrom);//予め保存していたデータをリストに挿入
            if (this.tabQueue.mvListCt > itemCt)
                this.tabQueue.mvListCt++;//挿入後はthis.tabQueue.mvListCtも適切に変更する必要がある
            this.tabQueue.move.from = -1;
            this.tabQueue.move.able = false;

            playRestart();//もし最後尾に再生するものが増えていたら再生してくれる。
        },
        moveCancel(){
            this.tabQueue.move.able = false;
            this.tabQueue.move.from = -1;
        },
        searchWordSubmitted() {
            if (this.tabSearch.word == "")
                return 0;
            
            let active_element = document.activeElement;// フォーカスを外す
            if(active_element){
                  active_element.blur();
                }
            getMovieList(this.tabSearch,true,this.tabSearch.word);
        },
        searchWordSubmittedMore() {
            if (this.tabSearch.wordSubmit == ""){
                if(this.tabSearch.word!=""){//もし未検索でmoreボタンを押して検索バーに文字があったら、その内容で検索
                    this.searchWordSubmitted();   
                }
                return 0;
                //ちなみに何も入力せずにmoreボタンを押していたら無視
            }

            getMovieList(this.tabSearch,false);
        },
        listMovieClicked(movie) {
            if (this.tabCommon.ListClickUniqueKey == movie.uniqueKey) {
                this.tabCommon.ListClickUniqueKey = "";
            } else {
                this.tabCommon.ListClickUniqueKey = movie.uniqueKey;
            }
        },
        tabChange(num) {
            this.tabCommon.ListClickUniqueKey = "";
            this.tabCommon.selectedTab = num;
            this.moveCancel();
        },
        relatedMovieMore(callback){//[callback..リスト追加後に行われる関数 任意]
            if(this.tabCommon.playerStart==false)
                return;
            getMovieList(this.tabPlay,false,undefined,callback);
        },
        addListStorage(LSkey){
            if(showLS().indexOf(LSkey)>=0){
//                this.tabQueue.LSkey.listNameConflict=true;
                //既に存在する リスト名
                if(!window.confirm(`${LSkey} を上書きします。よろしいですか？`))
                    return;
            }
            if(LSkey==="")
                return;
            storeLS(LSkey,this.tabQueue.mvList);
            this.openListStorageWindow('CLOSE');  
            return ;
        },
        openListStorage(LSkey){
            if(LSkey==''){
                return;
            }
            this.openListStorageWindow('CLOSE');
            if(this.tabCommon.playerStart==true){            
                this.tabQueue.mvList.splice(0,this.tabQueue.mvListCt);
                this.tabQueue.mvList.splice(1);
                this.tabQueue.mvListCt=0;
                this.moveCancel();
                this.tabQueue.mvList=[...this.tabQueue.mvList, ...getLS(LSkey)];
                playNextMovie();
                this.tabQueue.mvList.splice(0,1);
                this.tabQueue.mvListCt=0;
            }else{
                this.tabQueue.mvList=[];
                this.tabQueue.mvList=getLS(LSkey);
                playNextMovie();
            }
        },
        deleteListStorage(LSkey){
            if(LSkey==''){
                return;
            }
            if(window.confirm(`${LSkey} を削除します。よろしいですか？`)){
                deleteLS(LSkey);
                this.tabQueue.LSkey.list=showLS();  
                this.openListStorageWindow('CLOSE');
            }
        },
        openListStorageWindow(window){//selectLS
            //playerStart==falseに非対応
            switch(window){
                case 'INPUT':
                    this.tabQueue.LSkey.inputKey="";
                    this.tabQueue.LSkey.listNameConflict=false;
                    this.tabQueue.LSkey.inputWindow = true;
                    this.tabQueue.LSkey.listWindow = false;
                    break;
                case 'LIST_DELETE':
                    this.tabQueue.LSkey.listDeleteWindow =true;
                case 'LIST_OPEN' :
                    this.tabQueue.LSkey.inputKey="";
                    this.tabQueue.LSkey.inputWindow = false;
                    this.tabQueue.LSkey.listWindow = true;
                    this.tabQueue.LSkey.list=showLS();
                    break;
                case 'CLOSE':
                    this.tabQueue.LSkey.inputWindow = false;
                    this.tabQueue.LSkey.listWindow = false;
                    this.tabQueue.LSkey.listDeleteWindow =false;
                    break;
            }
        }
    }
}
function getMovieList(tab,listReset,newWordSubmit,callback) {
    /*引数
    tab..tabQueue,tabPlay,tabSearch
    listReset..true/false 
    [newWordSubmit..検索パラメータ 任意
    [callback..リスト更新後に行いたい関数 任意]

    tab.preWord+tab.wordSubmit (とnextPageTokenがあればこれも)をGETでyoutubeに送信
    tab.mvListに動画をpush
    tab.nextPageTokenを更新
    */

    //初期化処理
    if(listReset==true){
        tab.mvList=[];
        tab.nextPageToken='';
    }
    if(newWordSubmit != undefined){
        tab.wordSubmit=newWordSubmit;
    }

    const requestUrl
        = 'https://www.googleapis.com/youtube/v3/search?'
        + tab.preWord + tab.wordSubmit
        + (tab.nextPageToken == '' ? '' : '&pageToken=' + tab.nextPageToken)
        + '&key=' + YoutubeKey
        + '&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true';
    const date = new Date();
    axios.get(requestUrl)
        .then((res)=> {
            res.data.items.forEach((item, index) => {
                const dt=new Date(item.snippet.publishedAt);
                let dsc=item.snippet.description;
                if(dsc.length>210) //説明が長すぎる場合は210文字でカットして...を付ける
                    dsc=dsc.substring(0,210)+'...';
                const searchMovie = {
                    uniqueKey: `${date.getTime()}#${index}`,
                    Id: item.id.videoId,
                    title: item.snippet.title,
                    description210: dsc,
                    thumbnail: item.snippet.thumbnails.default.url,
                    publishedAt: dt.toLocaleString(),
                    description: '',//以下は検索リクエストからは取得できない値。再生時に動画毎に取得している
                    duration: '',
                    viewCount: '',
                    channelTitle: ''
                };
                tab.mvList.push(searchMovie);
            });
            tab.nextPageToken = res.data.nextPageToken;
            if(callback!=undefined && typeof callback =='function')
                setTimeout(callback, 100);
        }).catch(function (err) {
            console.log(err);
            iziToast.error({
                position: 'topRight',
                title: 'Reject http request',
                message: 'Youtubeとの通信に失敗し、動画の検索結果を取得することができませんでした。'
            });
        });
}

function getMovieInformation(mv){
    const requestUrl
        = 'https://www.googleapis.com/youtube/v3/videos?'
        +  'id=' +mv.Id
        + '&key=' + YoutubeKey
        + '&part=snippet,contentDetails,statistics&regionCode=jp';
//    const date = new Date();
    axios.get(requestUrl)
        .then(function (res) {
//            mv.uniqueKey=`${date.getTime()}#added`;
            mv.description = res.data.items[0].snippet.description;
            mv.duration = res.data.items[0].contentDetails.duration.replace('PT','').replace('H','hour').replace('M','min').replace('S','sec');
            mv.viewCount = res.data.items[0].statistics.viewCount;
            mv.channelTitle = res.data.items[0].snippet.channelTitle;
        }).catch(function (err) {
            console.log(err);
            iziToast.error({
                position: 'topRight',
                title: 'Reject http request',
                message: 'Youtubeとの通信に失敗し、動画の詳細を取得することができませんでした。'
            });
        });
}

</script>

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
</style>