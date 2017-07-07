/* global chrome */
import * as _ from 'underscore';
import * as $ from 'jquery';
import { Cookie, Store, App } from './modules';
import React from 'react';
import ReactDOM from 'react-dom';


window.onload = function () {
  const cookies = new Cookie();
  cookies.init().then(() => {
    cookies.getSaved().then(res => {
      ReactDOM.render(<App data={res} engine={cookies}/>, document.getElementById('root'));
    });
  });
};