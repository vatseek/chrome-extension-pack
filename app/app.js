/* global chrome */
import * as _ from 'underscore';
import { Cookie, Store } from './modules';

//const getCurrentDomainCookies = function () {
//    return new Promise(function (resolve, reject) {
//        async.waterfall([
//            function (callback) {
//                chrome.tabs.getSelected(null, (tab) => {
//                    const url = (new URL(tab.url)).hostname;
//                    if (url) {
//                        return callback(null, url);
//                    }
//                    return callback(new Error('No url'))
//                });
//            },
//            function (url, callback) {
//                chrome.cookies.getAll({domain: url}, (cookies) => {
//                    callback(null, cookies);
//                });
//            }
//        ], function (err, result) {
//            if (err) {
//                reject(err);
//            } else {
//                resolve(result);
//            }
//        });
//    });
//};


window.onload = function() {
    const cookies = new Cookie();
    cookies.init().then(res => {
        cookies.getSaved();
    });
    //getCurrentDomainCookies().then(res => {
    //    console.log(res);
    //}).catch(err => {
    //    console.log(err);
    //});
};