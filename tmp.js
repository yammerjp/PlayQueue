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
        + tab.preWord +tab.wordSubmit
        + (tab.nextPageToken==''?'':'&pageToken='+tab.nextPageToken)
        + '&key=' + YoutubeKey
        + '&part=snippet&order=relevance&regionCode=jp&type=video&videoEmbeddable=true';
    const date = new Date();

    axios.get(requestUrl)
        .then(function (res) {
            res.data.items.forEach((item, index) => {
                const searchMovie = {
                    uniqueKey: `${date.getTime()}#${index}`,
                    Id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.default.url
                };
                tab.mvList.push(searchMovie);
            });
            tab.nextPageToken = res.data.nextPageToken;

        }).catch(function (err) {
            console.log(err);
            iziToast.error({
                title: 'Reject http request',
                message: 'could not get movie details. Youtube reject http request.'
            });
        });
}