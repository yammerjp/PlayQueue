const TAB_PLAYER =0;
const TAB_QUEUE  =1;
const TAB_SEARCH =2;
const YoutubeKey="AIzaSyCCgdgCh4cw1pnscxtRsfP80M23lMlCdKY";

const vm =new Vue({
  el: "#app",
  data:{
    movieQueue :[
      { Id:"etKuJ7ibrvc",
        description:"お口の恋人ロッテのスペシャルアニメーション 「ベイビーアイラブユーだぜ」のフルバージョンを公開！ 企画・プロデュース:川村元気 監督:松...",
        thumbnail:"https://i.ytimg.com/vi/etKuJ7ibrvc/default.jpg",
        title:"ロッテ×BUMP OF CHICKEN ベイビーアイラブユーだぜ フルバージョン",
        uniqueKey:"1544599827709#0",
      }
    ],
    movieQueueCt : 0,

    searchWord: "",
    searchWordLS: "",
    nextPageToken: "",
    movieSearchList :[],
    ListClickUniqueKey:"",
    selectedTab : 1,
    movable:false,
    moveFrom:"",
  },/*
  mounted(){
  },*/
  methods:{
    
    newMovieQueue:function(msg,movie){
        switch(msg){
            case "PLAY_NOW":        
                vm.movieQueue.splice(vm.movieQueueCt+1,0,movie);
                playNextMovie()
                break;
            case "PLAY_NEXT":
                vm.movieQueue.splice(vm.movieQueueCt+1,0,movie);
                break;
            case "PLAY_LAST":
                vm.movieQueue.push(movie);
                break;

        }
    },
    changeMovieQueue(msg,item){
        const itemCt=vm.movieQueue.findIndex(({uniqueKey})=>uniqueKey===item.uniqueKey);
        /*↑uniqueキーが一致するmovieQueueの配列番号 つまりitemが存在するmovieQueue配列内の位置 */
        switch(msg){
            case "JUMP"://itemの位置に再生キューを移動して再生
                vm.movieQueueCt= itemCt-1;
                playNextMovie()
                break;
            case 'DELETE'://itemを再生キューから削除
                if(vm.movieQueueCt==itemCt)//現在再生中なら次を再生してから
                    playNextMovie();
                    vm.movieQueue.splice(itemCt,1);//削除
                break;
            
            case 'MOVE'://itemの位置を移動して再生キュー内の順番を変更
                if(vm.movieQueueCt==itemCt){
                    iziToast.error({ 
                        title: 'This movie is playing now', 
                        message: 'can not move movie in the list.' 
                      });
                    return 0;
                }
                
                vm.moveFrom=item;
                //削除前に、移動する動画のデータを保存しておく
                vm.movieQueue.splice(itemCt,1);//削除
                if(vm.movieQueueCt>itemCt)//削除に合わせてmovieQueueCtも現在再生しているものを指すように適切に変更
                    vm.movieQueueCt--;
                vm.movable=true;
                /*選択画面を挟んでから移動先が決定 */
                break;

        }
    },
    moveHere(item){
        let itemCt;
        if(item===0){
            itemCt=-1;//一番上に挿入する場合
        }else{
            itemCt= vm.movieQueue.findIndex(({uniqueKey})=>uniqueKey===item.uniqueKey);
        }
        vm.movieQueue.splice(itemCt+1,0,vm.moveFrom);//予め保存していたデータをリストに挿入
        if(vm.movieQueueCt>itemCt)
            vm.movieQueueCt++;//挿入後はvm.movieQueueCtも適切に変更する必要がある
        vm.moveFrom="";
        vm.movable=false;
    },

    searchWordSubmitted:function(){
      if(this.searchWord=="")
        return 0;
      const requestUrl 
        ='https://www.googleapis.com/youtube/v3/search?'
        + "q=" + this.searchWord
        +'&key='+YoutubeKey
        +'&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true';
      const date = new Date();

      axios.get(requestUrl)
        .then(function (res) {
          vm.movieSearchList =[];
          res.data.items.forEach((item,index) => {
            const searchMovie ={
                uniqueKey:  `${date.getTime()}#${index}`,
                Id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.default.url
              };
  //            console.log(searchMovie);
              vm.movieSearchList.push(searchMovie);
          });
          vm.nextPageToken=res.data.nextPageToken;
          vm.searchWordLS = vm.searchWord;
        
        }).catch(function (err) {
          console.log(err);
          iziToast.error({ 
            title: 'Reject http request', 
            message: 'could not get movie details. Youtube reject http request.' 
          });
        });
    },

    searchWordSubmittedMore:function(){
        if(this.searchWordLS=="")
            return 0;
          const requestUrl 
          ='https://www.googleapis.com/youtube/v3/search?'
          + "q=" + this.searchWordLS
          +'&key='+YoutubeKey
          +'&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true'
          +'&pageToken='+ this.nextPageToken;
        const date = new Date();
  
        axios.get(requestUrl)
          .then(function (res) {
            res.data.items.forEach((item,index) => {
              const searchMovie ={
                  uniqueKey:  `${date.getTime()}#${index}`,
                  Id: item.id.videoId,
                  title: item.snippet.title,
                  description: item.snippet.description,
                  thumbnail: item.snippet.thumbnails.default.url
                };
                vm.movieSearchList.push(searchMovie);
            });
            vm.nextPageToken=res.data.nextPageToken;
          }).catch(function (err) {
            console.log(err);
            iziToast.error({ 
              title: 'Reject http request', 
              message: 'could not get movie details. Youtube reject http request.' 
            });
        });
    },

    listMovieClicked:function(movie){
        if(vm.ListClickUniqueKey==movie.uniqueKey){
            vm.ListClickUniqueKey = "";
        }else{
            vm.ListClickUniqueKey=movie.uniqueKey;
        }
    },
    tabChange(num){
        vm.ListClickUniqueKey = "";
        vm.selectedTab=num;
    }
  }
});

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: vm.movieQueue[0].Id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError':onPlayerError
    }
  });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
  if(event.data == YT.PlayerState.ENDED)
    playNextMovie();
}

function onPlayerError(event){
  switch(event.data){
    case 2://リクエストが無効なパラメータ値 動画IDのフォーマットが異なる
    case 5://HTML5プレイヤーに関するエラー
    case 100://動画が見つからない(非公開含む)
    case 101://埋め込み不可の動画
    case 150://埋め込み不可の動画
      playNextMovie();
      iziToast.error({ 
        title: 'Skip Movie', 
        message: 'The skipped movie is not permitted on Youtube embedded player.'
      });
      break;

    default:
      iziToast.error({ title: 'Unknown Error', message: 'Stop movie' });
  }
}

function playNextMovie(){ //MovieQueueが全て再生したら最初からループ
  vm.movieQueueCt = (vm.movieQueueCt+1) % vm.movieQueue.length;
//  if(vm.movieQueue.length > vm.movieQueueCt +1 );
    player.loadVideoById({
      videoId: vm.movieQueue[ vm.movieQueueCt ].Id,
      suggestedQuality:'small'
    });
}