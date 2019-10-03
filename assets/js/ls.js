/*
//localStorage.clear();
if(!(('localStorage' in window) && (window.localStorage !== null))) {
    // ローカルストレージが使えない。。。
    iziToast.error({
        title: 'Local Storage Error',
        message: '保存機能が使えません。ブラウザがHTML5 Local Storageに対応していません。'
    });
}*/
export default {
    store: (listName, mvList) => {
        localStorage.setItem(listName, JSON.stringify(mvList));
    },
    show: () => {//keyの配列
        return Object.keys(localStorage);
    },
    get: (listName) => {
        return JSON.parse(localStorage.getItem(listName));
    },
    delete: (listName) => {
        localStorage.removeItem(listName);
    }
}