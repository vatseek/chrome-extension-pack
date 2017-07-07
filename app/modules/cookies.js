const async = require('async');
import Stores from './stores';
import * as _ from 'underscore';

class Cookies {
  constructor() {
    this.url = null;
    this.store = null;
  }

  init() {
    return this.__getUrl().then(url => {
      if (!url) Promise.reject(url);
      this.url = url;
      this.store = new Stores(url);
      return Promise.resolve();
    });
  }

  __getUrl() {
    const getTab = new Promise(res => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
        return res(tab);
      });
    });

    return getTab.then(tabs => {
      if (!_.isArray(tabs)) {
        return Promise.reject(new Error('No tabs'));
      }
      const url = (new URL(_.first(tabs).url)).hostname;
      return Promise.resolve(url.replace(/^www(.*)/, '$1'));
    })
  }

  __getCookiesByDomain(domain) {
    return new Promise(res => {
      chrome.cookies.getAll({domain: domain}, (cookies) => {
        res(cookies);
      });
    })
  }

  __getCurrentTabCookies() {
    return this.__getUrl().then(url => {
      return this.__getCookiesByDomain(url);
    }).then(cookies => {
      return Promise.resolve(cookies);
    }).catch(e => {
      return Promise.reject(e);
    })
  }

  __removeCookie(url, name) {
    return new Promise(res => {
      chrome.cookies.remove({ url, name }, () => {
        res(true);
      });
    });
  }

  __addCookie(cookie) {
    return new Promise((resolve, reject) => {
      chrome.cookies.set(cookie, (result) => {
        resolve(cookie);
      });
    });
  }

  __getUrlString(domain, secure) {
    if (domain[0] == '.') {
      domain = 'www' + domain;
    }
    if (secure) {
      return `https://${domain}/`;
    }
    return `http://${domain}/`;
  }

  __setByDomain(domain, data) {
    return this.__getCookiesByDomain(domain).then(cookies => {
      let promises = [];
      _.each(cookies, cookie => {
        const url = this.__getUrlString(domain, cookie.secure);
        promises.push(this.__removeCookie(url, cookie.name))
      });
      return Promise.all(promises);
    }).then(() => {
      let promises = [];
      _.each(data, item => {
        item.url = this.__getUrlString(domain, item.secure);
        item = _.omit(item, ['hostOnly', 'session']);
        promises.push(this.__addCookie(item));
      });
      return Promise.all(promises);
    });
  }

  getCookies() {
    return this.__getCurrentTabCookies();
  }

  getSaved() {
    return this.store.getData();
  }

  create(name) {
    let data = {};
    return this.getCookies().then(cookies => {
      data[name] = cookies;
      return this.store.setData(data);
    }).then(() => {
      this.store.getData();
    });
  }

  remove(name) {
    return this.store(name).then(() => {
      return this.getData();
    });
  }

  reload() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    });
  }

  load(name) {
    return this.store.getData().then(result => {
      const data = _.filter(result, function (item, index) {
        return index == name
      });
      const cookies = _.first(data);
      if (!cookies) {
        return Promise.reject(new Error('no data'));
      }
      return this.__setByDomain(this.url, cookies)
    });
  }
}

export default Cookies;