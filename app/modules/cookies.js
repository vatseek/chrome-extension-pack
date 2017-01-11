const async = require('async');
import Stores from './stores';

class Cookies {
    constructor() {
        this.url = null;
        this.store = null;
    }

    init() {
        let self = this;
        return new Promise((resolve, reject) => {
            this._getUrl(function(err, url) {
                if (!err) {
                    self.url = url;
                    self.store = new Stores(url);
                    resolve();
                }
                reject(err);
            })
        });
    }

    _getTab(callback) {
        chrome.tabs.getSelected(null, (tab) => {
            return callback(tab);
        });
    }

    _getUrl(callback) {
        this._getTab((tab) => {
            const url = (new URL(tab.url)).hostname;
            if (url) {
                return callback(null, url);
            }
            return callback(new Error('No url'))
        });
    }

    _getByDomain(domain, callback) {
        chrome.cookies.getAll({domain: domain}, (cookies) => {
            callback(null, cookies);
        });
    }

    _getCurrent(callback) {
        const self = this;
        async.waterfall([
            function (callback) {
                self._getUrl(callback);
            },
            function (domain, callback) {
                self._getByDomain(domain, callback)
            }
        ], function (err, result) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    getCookies() {
        return new Promise((resolve, reject) => {
            this._getCurrent((err, res) => {
                if (err) {
                    return reject(err);
                }
                resolve(res);
            });
        });
    }

    getSaved() {
        //let store = new Stores(this.url);

        //store.clearData();

        //store.setData({mas: {s: "asdfasd"}}).then(() =>{
        //    store.setData({ole: 3}).then(() => {
        //        store.getData().then(res => {
        //            console.log(res);
        //        })
        //    });
        //});

        this.getCookies().then(result => {
            console.log(result, JSON.stringify(result).length);
        });
    }
}

export default Cookies;