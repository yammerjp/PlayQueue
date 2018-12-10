const TAB_PLAYER =0;
const TAB_QUEUE  =1;
const TAB_SEARCH =2;
const YoutubeKey="AIzaSyCCgdgCh4cw1pnscxtRsfP80M23lMlCdKY";

const vm =new Vue({
  el: "#app",
  data:{
    movieQueue :[
    
      { Id: 'OvWqYBBIYww',
        title:'【ハタラクティブWebCM】選択篇（年末ver.）15秒 ',
        description:'女優・小林涼子さんから正社員就職を考える方へ。 就職するまでひとりで頑張るか、プロに相談するか。あなたならどうしますか。 若手フリーター・既卒の就職・転職なら『ハタラクティブ』 https://hataractive.jp/',
        thumbnail: 'https://i.ytimg.com/vi/OvWqYBBIYww/default.jpg'
      }/*,
      { Id: 'drSMZgnmJjk'},
      { Id: 'mBlGOx4HdXM' },
      { Id: 'tTPOSNxCZF4'},
      { Id: 'IGInsosP0Ac'},
      { Id: 'C-xF2MAFw5s'},
      { Id: 'x9v8aNl6Aps'},
      { Id: 'Hh9yZWeTmVM'},
      { Id: 'RgKp3ppdhWs'},
      { Id: '5GQnC6UUsZw'}*/
    ],
    movieQueueCt : 0,
    newMovieId:"",

    searchWord: "",
    movieSearchList :[],
    selectedTab : 1
  },/*
  mounted(){
  },*/
  methods:{
    newMovieIdSubmitted:function(){
      //今後はsearchしたときに引っ張ってきたデータをそのまま渡すので、こちら側でhttp getしてデータを取りに行かなくてよくなる予定。
      const requestUrl 
        ='https://www.googleapis.com/youtube/v3/videos?id='
        + this.newMovieId
        +'&key='+YoutubeKey
        +'&part=snippet,status';
      axios.get(requestUrl)
        .then(function (res) {
//          console.log(res.data.items[0]);
          if(res.data.items[0].status.embeddable==true){  
          //一応埋め込み可否っぽい値を判断しているが、埋め込み不可動画でもtrueで通ってしまった このまま解決しないならこの部分はいらない。
            const newMovieQueue ={
              Id: vm.newMovieId,
              title: res.data.items[0].snippet.title,
              description: res.data.items[0].snippet.description,
              thumbnail: res.data.items[0].snippet.thumbnails.default.url
            };
            vm.movieQueue.push(newMovieQueue);
          }else{
            iziToast.error({ 
              title: 'Not permitted', 
              message: 'The movie is not permitted on Youtube embedded player.' 
            });
          }
        }).catch(function (err) {
          console.log(err);
          iziToast.error({ 
            title: 'Reject http request', 
            message: 'could not get movie details. Youtube reject http request.' 
          });
        });
    },
    searchWordSubmitted:function(){
      const requestUrl 
        ='https://www.googleapis.com/youtube/v3/search?'
        + "q=" + this.searchWord
        +'&key='+YoutubeKey
        +'&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true';
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
  //            console.log(searchMovie);
              vm.movieSearchList.push(searchMovie);
          });
        }).catch(function (err) {
          console.log(err);
          iziToast.error({ 
            title: 'Reject http request', 
            message: 'could not get movie details. Youtube reject http request.' 
          });
        });
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