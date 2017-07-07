import * as _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';

import Cookies from './cookies.js'
import Stores from './stores.js'

export const Cookie = Cookies;
export const Store = Stores;

const Row = React.createClass({
  getDefaultProps() {
    return {
      handleRun: function () {
      },
      handleDelete: function () {
      },
      name: ''
    }
  },
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td className="right-align">
          <a className="btn-floating" onClick={() => {
            this.props.handleRun(this.props.name)
          }}>
            <i className="material-icons">loop</i>
          </a>
          <a className="btn-floating red" onClick={() => {
            this.props.handleDelete(this.props.name)
          }}>
            <i className="material-icons">delete</i>
          </a>
        </td>
      </tr>
    );
  }
});

const Table = React.createClass({
  render() {
    if (_.isEmpty(this.props.data)) {
      return (
        <div className="card-panel yellow lighten-2">
          <b>Info!</b> Just save your current state to load it in future.
        </div>
      );
    }
    return (
      <table className="striped">
        <thead>
        <tr>
          <th>Name</th>
          <th className="action-width center-align">Actions</th>
        </tr>
        </thead>
        <tbody>
        {_.map(this.props.data, (item, index) => {
          return (
            <Row key={index} name={index} data={item} {...this.props}/>
          )
        })}
        </tbody>
      </table>
    );
  }
});

const app = React.createClass({
  getInitialState() {
    return {
      name: '',
      data: this.props.data,
      logout: true,
    }
  },
  handleSave(e) {
    e.preventDefault();
    if (this.state.name) {
      this.props.engine.create(this.state.name, this.state.logout).then(data => {
        if (this.state.logout) {
          this.props.engine.reload();
        }
        this.setState({data});
      });
    }
  },
  handleChange(e) {
    this.setState({name: e.target.value});
  },
  handleRun(name) {
    this.props.engine.load(name).then(res => {
      this.props.engine.reload();
    });
  },
  handleDelete(name) {
    this.props.engine.remove(name).then((data) => {
      this.setState({data});
    });
  },
  handleChangeLogin(e) {
    this.setState({logout: !this.state.logout});
  },
  render() {
    return (
      <div>
        <form className="col s12">
          <div className="row">
            <div className="input-field col s9">
              <input type="text" className="validate short-input" placeholder="Snapshot name" onChange={this.handleChange}/>
              <input type="checkbox" id="logout" value="1" checked={this.state.logout} onChange={this.handleChangeLogin} />
              <label htmlFor="logout">Logout after save (to login another)</label>
            </div>
            <div className="input-field col s3">
              <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleSave}>
                Save<i className="mdi-content-send right"></i>
              </button>
            </div>
          </div>
        </form>
        <Table {...this.props} data={this.state.data} handleRun={this.handleRun} handleDelete={this.handleDelete}/>
      </div>
    );
  }
});

export const App = app;