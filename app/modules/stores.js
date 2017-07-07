const md5 = require('md5');
import * as _ from 'underscore';

class Stores {
  constructor(url) {
    this.hash = md5(url);
  }

  getData() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.hash], (res) => {
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
        chrome.storage.local.set(result, function () {
          resolve();
        });
      });
    });
  }

  clearData() {
    let data = {};
    data[this.hash] = {};
    chrome.storage.local.set(data, function () {
    });
  }

  remove(name) {
    return new Promise((resolve, reject) => {
      this.getData().then(res => {
        let toSave = _.omit(res, name) || {};
        let result = {[this.hash]: toSave};
        chrome.storage.local.set(result, function () {
          resolve();
        });
      });
    });
  }
}

export default Stores;
