const TAB_PLAYER = 0;
const TAB_QUEUE = 1;
const TAB_SEARCH = 2;
const SEARCHED = 0;
const RELATED = 1;
const YoutubeKey = "AIzaSyBxO0o94z2pTyey5aEdEN3PnkpyNJj4hjE";

const vm = new Vue({
    el: "#app",
    data: {
        tabQueue: {
            mvList: [/*//movieQueue
                {
                    Id: "etKuJ7ibrvc",
                    description: "お口の恋人ロッテのスペシャルアニメーション 「ベイビーアイラブユーだぜ」のフルバージョンを公開！ 企画・プロデュース:川村元気 監督:松...",
                    thumbnail: "https://i.ytimg.com/vi/etKuJ7ibrvc/default.jpg",
                    title: "ロッテ×BUMP OF CHICKEN ベイビーアイラブユーだぜ フルバージョン",
                    uniqueKey: "1544599827709#0",
                    publishedAt:"",
                } */ 
                {
                    Id: "",
                    description: "",
                    thumbnail: "",
                    title: "",
                    uniqueKey: "",
                    publishedAt:"",
                } ],
            mvListCt: 0,//movieQueueCt
            move: {
                able: false,//movable
                from: -1,//moveFrom
            },
        },
        tabPlay: {
            mvList: [],
            nextPageToken: '',
            preWord: 'relatedToVideoId=',
            wordSubmit: '',// 
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
    },
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
            switch (msg) {
                case "PLAY_NOW":
                    this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, movie);
                    playNextMovie()
                    break;
                case "PLAY_NEXT":
                    this.tabQueue.mvList.splice(this.tabQueue.mvListCt + 1, 0, movie);
                    playRestart();//もし最後尾に再生するものが増えていたら再生してくれる。
                    break;
                case "PLAY_LAST":
                    this.tabQueue.mvList.push(movie);
                    playRestart();//もし最後尾に再生するものが増えていたら再生してくれる。
                    break;

            }
        },
        changeMovieQueue(msg, item) {
            const itemCt = this.tabQueue.mvList.findIndex(({ uniqueKey }) => uniqueKey === item.uniqueKey);
            /*↑uniqueキーが一致するtabQueue.mvListの配列番号 つまりitemが存在するtabQueue.mvList配列内の位置 */
            switch (msg) {
                case "JUMP"://itemの位置に再生キューを移動して再生
                    this.tabQueue.mvListCt = itemCt - 1;
                    playNextMovie();
                    break;
                case 'DELETE'://itemを再生キューから削除
//                    if (this.tabQueue.mvListCt == itemCt)//現在再生中なら次を再生してから
//                        playNextMovie();
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
        moveCancel: function(){
            this.tabQueue.move.able = false;
            this.tabQueue.move.from = -1;
        },

        searchWordSubmitted: function () {
            if (this.tabSearch.word == "")
                return 0;
            
            let active_element = document.activeElement;// フォーカスを外す
            if(active_element){
                  active_element.blur();
                }
            this.tabSearch.wordSubmit= this.tabSearch.word;

            this.tabSearch.mvList=[];        //初期化
            this.tabSearch.nextPageToken=''; //初期化
            getMovieList(this.tabSearch);
        },

        searchWordSubmittedMore: function () {
            if (this.tabSearch.wordSubmit == ""){
                if(this.tabSearch.word!=""){//もし未検索でmoreボタンを押して検索バーに文字があったら、その内容で検索
                    this.searchWordSubmitted();   
                }
                return 0;
                //ちなみに何も入力せずにmoreボタンを押していたら無視
            }

            getMovieList(this.tabSearch);
        },

        listMovieClicked: function (movie) {
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
        relatedMovieMore(){
            if(this.tabCommon.playerStart==false)
                return;
            if(this.tabPlay.mvList==[])
                this.tabPlay.nextPageToken='';
            getMovieList(this.tabPlay);
        },
    }
});


function replacePlayer(){
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
let player;


function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: vm.tabQueue.mvList[0].Id,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    vm.tabPlay.mvList =[];
    vm.tabPlay.nextPageToken = '';
    vm.tabPlay.wordSubmit=vm.tabQueue.mvList[vm.tabQueue.mvListCt].Id;
    getMovieList(vm.tabPlay);
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED)
        playNextMovie();
}

function onPlayerError(event) {
    switch (event.data) {
        case 100://動画が見つからない(非公開含む)
            playNextMovie();
            iziToast.error({
                title: 'Skip Movie',
                message: '動画が見つかりません。削除や非公開化によるものです。'
            });
            break;    
        case 101://埋め込み不可の動画
        case 150://埋め込み不可の動画
            playNextMovie();
            iziToast.error({
                title: 'Skip Movie',
                message: '埋め込み不可の動画です。'
            });
            break;
        case 2://リクエストが無効なパラメータ値 動画IDのフォーマットが異なる
            playNextMovie();
            iziToast.error({
                title: 'Skip Movie',
                message: 'Youtubeへの再生リクエストに無効なパラメータが設定されました。動画IDのフォーマットが異なる可能性があります。'
            });
            break;
        case 5://HTML5プレイヤーに関するエラー
            playNextMovie();
            iziToast.error({
                title: 'Skip Movie',
                message: 'HTML5プレイヤーに関するエラーが発生しました。'
            });
            break;
        
        default:
            iziToast.error({ title: 'Unknown Error', message: 'Stop movie' });
    }
}

function playNextMovie() { //tabQueue.mvListが全て再生したら最初からループ
    if(vm.tabCommon.playerStart==false){//ページロード後最初の再生時にプレイヤーはプレイヤーを読み込む。
        vm.tabQueue.mvList.shift();
        vm.tabQueue.mvListCt=0;
        replacePlayer();
        vm.tabCommon.playerStart=true;
        vm.tabCommon.playerFinish=false;
        return;
    }
    if(vm.tQloop==false){//ループがオフ
        if(vm.tabQueue.mvListCt + 1 >=vm.tabQueue.mvList.length){//リストの末尾に到達
            if(vm.tQautoPlayRelatedMovie==true){//末尾動画の関連動画再生がOn
                            vm.addMovieQueue("PLAY_NOW", vm.tabPlay.mvList[0]);
            }else{//ループせず関連動画も再生しない
                vm.tabCommon.playerFinish=true;
            }
            return 0;
        }
        vm.tabQueue.mvListCt = vm.tabQueue.mvListCt + 1;
    }else{//ループがオン
        vm.tabQueue.mvListCt = (vm.tabQueue.mvListCt + 1) % vm.tabQueue.mvList.length;
    }
    player.loadVideoById({
        videoId: vm.tabQueue.mvList[vm.tabQueue.mvListCt].Id,
        suggestedQuality: 'small'
    });
    if(vm.tabQueue.move.able==true
    &&vm.tabQueue.move.from==vm.tabQueue.mvListCt){
        vm.moveCancel();
    }

    //関連動画リストの取得
    vm.tabPlay.mvList =[];
    vm.tabPlay.nextPageToken = '';
    vm.tabPlay.wordSubmit=vm.tabQueue.mvList[vm.tabQueue.mvListCt].Id;
    getMovieList(vm.tabPlay);
}

function getMovieList(tab) {
    //vm.movieSearchList =[]; リストの初期化は関数外で行う
    //nextPageToken=''
    //wordSubmit=word

    /* tab.preWord+tab.wordSubmit (とnextPageTokenがあればこれも)をGETでyoutubeに送信
    tab.mvListに動画をpush
    tab.nextPageTokenを更新
    */
    const requestUrl
        = 'https://www.googleapis.com/youtube/v3/search?'
        + tab.preWord + tab.wordSubmit
        + (tab.nextPageToken == '' ? '' : '&pageToken=' + tab.nextPageToken)
        + '&key=' + YoutubeKey
        + '&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true';
    const date = new Date();
    axios.get(requestUrl)
        .then(function (res) {
            res.data.items.forEach((item, index) => {
                const dt=new Date(item.snippet.publishedAt);
                let dsc=item.snippet.description;
                if(dsc.length>210) //説明が長すぎる場合は210文字でカットして...を付ける
                    dsc=dsc.substring(0,210)+'...';
                const searchMovie = {
                    uniqueKey: `${date.getTime()}#${index}`,
                    Id: item.id.videoId,
                    title: item.snippet.title,
                    description: dsc,
                    thumbnail: item.snippet.thumbnails.default.url,
                    publishedAt: dt.toLocaleString(),
                };
                tab.mvList.push(searchMovie);
            });
            tab.nextPageToken = res.data.nextPageToken;

        }).catch(function (err) {
            console.log(err);
            iziToast.error({
                title: 'Reject http request',
                message: 'Youtubeとの通信に失敗し、動画の検索結果を取得することができませんでした。'
            });
        });
}
function playRestart(){
    if(vm.tabCommon.playerFinish==true){
        vm.tabCommon.playerFinish=false;
        playNextMovie();
    }
}