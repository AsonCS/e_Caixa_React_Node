import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { allClients, CORRENTE, POUPANCA, ESPECIAL } from '../actions/clientsActions';
import input from "../img/input.svg";
import add from "../img/add.svg";

import '../App.css';

class App extends Component {
    state = {
        number : 0
    }
    
    newConta = () => {
        window.history.pushState(null, "New Conta", "/new");
        window.location = "/new";
    }
    
    componentWillMount() {
        this.props.allClients();
    }
    
    indentifyType = (type) => {
        switch (type){
            case CORRENTE:
                return "Conta Corrente Comum";
            case POUPANCA:
                return "Conta Poupança";
            case ESPECIAL:
                return "Conta Corrente Especial";
            default:
                return "Tipo não definido"
        }
    };
    
    onClick = (e) => {
        if(e.target.parentNode.firstChild.nextSibling){
            this.setState({
                number : e.target.parentNode.firstChild.nextSibling.textContent
            });
        }else{
            this.setState({
                number : e.target.parentNode.parentNode.firstChild.nextSibling.textContent
            });
        }
    }
    
    render() {
        
        if (this.state.number !== 0){
            return <Redirect push to={{ pathname: "/login", state: { number: this.state.number } }} />;
        }
        
        var clientList = <tr></tr>;
        if (this.props.clients){
            clientList = this.props.clients.map(client => (
                <tr key={ client.numero } onClick={this.onClick} >
                    <td>
                        <img src={ input } alt="enter" width="48px" height="48px" />
                    </td>
                    <td>
                        { client.numero }
                    </td>
                    <td>
                        { client.cliente }
                    </td>
                    <td>
                        { this.indentifyType(client.tipo_cod) }
                    </td>
                </tr>
            ));
        }
        
        return (
            <div className="App">
                <div className="App-header">
                    <div className="alert alert-primary" role="alert">
                        Lista de clientes
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <img src={ add } alt="adicionar" width="48px" height="48px" onClick={ this.newConta } />
                                </th>
                                <th>
                                    Número da Conta
                                </th>
                                <th>
                                    Nome do cliente
                                </th>
                                <th>
                                    Tipo da Conta
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { clientList }
                        </tbody>
                    </table>                    
                </div>
            </div>
        );
    }
};

App.propTypes = {
    allClients : PropTypes.func.isRequired,
    clients : PropTypes.array
};

const mapStateToProps = state => ({
    clients : state.clients.allClients
});

export default connect(mapStateToProps, { allClients })(App);
