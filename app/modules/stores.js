const md5 = require('md5');
import * as _ from 'underscore';

class Stores {
    constructor(url) {
        this.hash = md5(url);
    }

    getData() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([this.hash], (res) => {
                if (_.has(res, this.hash)) {
                    resolve(res[this.hash])
                }
                resolve({});
            });
        });
    }

    setData(data) {
        return new Promise((resolve, reject) => {
            this.getData().then(res => {
                let toSave = res || {};
                let result = {};
                result[this.hash] = {...toSave, ...data};
                chrome.storage.sync.set(result, function() {
                    resolve();
                });
            });
        });
    }

    clearData() {
        let data = {};
        data[this.hash] = {};
        chrome.storage.sync.set(data, function() { });
    }
}

export default Stores;
