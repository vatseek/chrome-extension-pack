const async = require('async');
import Stores from './stores';
import * as _ from 'underscore';

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

    _setByDomain(domain, newData, callback) {
        const self = this;
        async.waterfall([
            function (callback) {
                //Get all by domain
                return self._getByDomain(domain, callback);
            },
            function(cookies, callback) {
                for (let i in cookies) {
                    let url = '';
                    if (cookies[i].secure) {
                        url = `https://${domain}/`;
                    } else {
                        url = `http://${domain}/`;
                    }
                    chrome.cookies.remove({ url: url, name: cookies[i].name});
                }
                setTimeout(function() {
                    callback(null, {});
                }, 50);
            },
            function (res, callback) {
                //Set new data
                for (let i in newData) {
                    let item = newData[i];
                    item.url = item.secure ? `https://${item.domain}` : `http://${item.domain}`;
                    item = _.omit(item, ['hostOnly', 'session']);
                    chrome.cookies.set(item);
                }
                setTimeout(function() {
                    callback(null, {});
                }, 50);
            }

        ], function (err, result) {
            callback(err, result);
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
        return this.store.getData();
    }

    create(name) {
        let data = {};
        return new Promise((res, rej) => {
            this.getCookies().then(cookies => {
                data[name] = cookies;
                this.store.setData(data).then(() => {
                    this.store.getData().then(result => {
                        res(result);
                    });
                });
            });
        });
    }

    remove(name) {
        return new Promise((res, rej) => {
            this.store.remove(name).then(() =>{
                this.store.getData().then(result => {
                    res(result);
                });
            });
        });
    }

    load(name) {
        return new Promise((res, rej) => {
            this.store.getData().then(result => {
                const data = _.filter(result, function(item, index) {
                    return index == name
                });
                const cookies = _.first(data);
                if (!cookies) {
                    return reject(new Error('no data'));
                }

                this._setByDomain(this.url, cookies, () => {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        console.log(tabs);
                        chrome.tabs.reload(tabs[0].id);
                    });
                    res();
                })
            });
        });
    }
}

export default Cookies;