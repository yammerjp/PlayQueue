//localStorage.clear();
if(!(('localStorage' in window) && (window.localStorage !== null))) {
    // ローカルストレージが使えない。。。
    iziToast.error({
        title: 'Local Storage Error',
        message: '保存機能が使えません。ブラウザがHTML5 Local Storageに対応していません。'
    });
}

function storeLS(listName,mvList){
    localStorage.setItem(listName, JSON.stringify(mvList));
}
function showLS(){//keyの配列
    return Object.keys(localStorage);
}
function getLS(listName){
    return JSON.parse(localStorage.getItem(listName));
}
function deleteLS(listName){
    localStorage.removeItem(listName);
}
