import Cookies from './cookies.js'
import Stores from './stores.js'
import React from 'react';
import ReactDOM from 'react-dom';

export const Cookie = Cookies;
export const Store = Stores;

const Row = React.createClass({
    render() {
        return (
            <tr>
                <td>Alvin</td>
                <td className="right-align">
                    <a className="btn-floating disabled">
                        <i className="material-icons">loop</i>
                    </a>
                    <a className="btn-floating red">
                        <i className="material-icons">delete</i>
                    </a>
                </td>
            </tr>
        );
    }
});

const Table = React.createClass({
    render() {
        return (
            <table className="striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th className="action-width center-align">Actions</th>
                </tr>
                </thead>
                <tbody>
                <Row />
                <Row />
                <Row />
                </tbody>
            </table>
        );
    }
});

const app = React.createClass({
    getInitialState() {
        return { name: '' }
    },
    handleClick(e) {
        e.preventDefault();
        //TODO: click
    },
    handleChange(e) {
        this.setState({ name: e.target.value});
    },
    render() {
        return (
            <div>
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s9">
                            <input id="first_name" type="text" className="validate" placeholder="First Name" onChange={this.handleChange} />
                        </div>
                        <div className="input-field col s3">
                            <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.handleClick}>
                                Add<i className="mdi-content-send right"></i>
                            </button>
                        </div>
                    </div>
                </form>
                <Table {...this.props} />
            </div>
        );
    }
});

export const App = app;