const axios = require("axios");
//const YoutubeKey = "AIzaSyAXVeNZpwqKoLvjbUaGj2Gug8IsZCm95vo";
//const YoutubeKey = "AIzaSyANKSN8GKCbogYzLXqG4f75lwqwljA3RCU";
const YoutubeKey = require('@/youtube-key.js')
export default {
    getMovieList:(tab, listReset, newWordSubmit, callback)=>{
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
    if (listReset == true) {
      tab.mvList = [];
      tab.nextPageToken = "";
    }
    if (newWordSubmit != undefined) {
      tab.wordSubmit = newWordSubmit;
    }
  
    const requestUrl =
      "https://www.googleapis.com/youtube/v3/search?" +
      tab.preWord +
      tab.wordSubmit +
      (tab.nextPageToken == "" ? "" : "&pageToken=" + tab.nextPageToken) +
      "&key=" +
      YoutubeKey +
      "&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true";
    const date = new Date();
    axios
      .get(requestUrl)
      .then(res => {
        res.data.items.forEach((item, index) => {
          const dt = new Date(item.snippet.publishedAt);
          let dsc = item.snippet.description;
          if (dsc.length > 210)
            //説明が長すぎる場合は210文字でカットして...を付ける
            dsc = dsc.substring(0, 210) + "...";
          const searchMovie = {
            uniqueKey: `${date.getTime()}#${index}`,
            Id: item.id.videoId,
            title: item.snippet.title,
            description210: dsc,
            thumbnail: item.snippet.thumbnails.default.url,
            publishedAt: dt.toLocaleString(),
            description: "", //以下は検索リクエストからは取得できない値。再生時に動画毎に取得している
            duration: "",
            viewCount: "",
            channelTitle: ""
          };
          tab.mvList.push(searchMovie);
        });
        tab.nextPageToken = res.data.nextPageToken;
        if (callback != undefined && typeof callback == "function")
          setTimeout(callback, 100);
      })
      .catch(function(err) {
        console.log(err);
        iziToast.error({
          position: "topRight",
          title: "Reject http request",
          message:
            "Youtubeとの通信に失敗し、動画の検索結果を取得することができませんでした。"
        });
      });
  },
  
    getMovieInformation:(mv)=>{
    const requestUrl =
      "https://www.googleapis.com/youtube/v3/videos?" +
      "id=" +
      mv.Id +
      "&key=" +
      YoutubeKey +
      "&part=snippet,contentDetails,statistics&regionCode=jp";
    //    const date = new Date();
    axios
      .get(requestUrl)
      .then(function(res) {
        //            mv.uniqueKey=`${date.getTime()}#added`;
        mv.description = res.data.items[0].snippet.description;
        mv.duration = res.data.items[0].contentDetails.duration
          .replace("PT", "")
          .replace("H", "hour")
          .replace("M", "min")
          .replace("S", "sec");
        mv.viewCount = res.data.items[0].statistics.viewCount;
        mv.channelTitle = res.data.items[0].snippet.channelTitle;
      })
      .catch(function(err) {
        console.log(err);
        iziToast.error({
          position: "topRight",
          title: "Reject http request",
          message:
            "Youtubeとの通信に失敗し、動画の詳細を取得することができませんでした。"
        });
      });
  }
}