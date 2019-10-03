const TAB_PLAYER = 0;
const TAB_QUEUE = 1;
const TAB_SEARCH = 2;
const SEARCHED = 0;
const RELATED = 1;
//const YoutubeKey = "AIzaSyAXVeNZpwqKoLvjbUaGj2Gug8IsZCm95vo";
const YoutubeKey = "AIzaSyANKSN8GKCbogYzLXqG4f75lwqwljA3RCU";
let player;

const vm = new Vue({
    el: "#app",
    data: {
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
});
