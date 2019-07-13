import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { findClient } from '../actions/clientsActions';

class Login extends Component {
    state = {
        conta : undefined
    }
    
    handleClick(e) {
        e.preventDefault();
        const numconta = this.refs.numconta.value;
        const senha = this.refs.senha.value;
        this.props.findClient({
            number : numconta,
            senha : senha
        });
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.conta){
            nextProps.conta.senha = this.refs.senha.value;
            this.setState({
                conta: nextProps.conta
            });
        }else if(nextProps.error){
            console.log(nextProps.error);
            alert("Erro ao fazer login...");
        }
    }
    
    componentDidMount(){
        if(this.props.location.state){
            this.refs.senha.focus();
        }else{
            this.refs.numconta.focus();
        }
    }
    
    render() {
        
        if (this.state.conta){
            return <Redirect push to={{ pathname: "/manipulate", state: { conta: this.state.conta } }} />;
        }
        
        
        var number = "";
        if(this.props.location.state){
            number = this.props.location.state.number;
        }
        
        return (
            <div className="App">
                <div className="App-header">
                    <div className="alert alert-success" role="alert">
                        Entrar na Conta
                    </div>

                    <form action="#" onSubmit = {(e) => this.handleClick(e)} id="form">
                        <table>
                            <tbody>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="numconta">Numero da Conta: </label>
                                    </td>
                                    <td>
                                        <input ref = "numconta" name="numconta" type="number" className="form-control" id="numconta" 
                                            defaultValue={ number } placeholder="Numero Conta" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="senha">Senha: </label>
                                    </td>
                                    <td>
                                        <input ref = "senha" type="password" className="form-control" name="senha" id="senha" placeholder="Senha" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <button type="submit" className="btn btn-primary">Login</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form> 
                </div>
            </div>
        );
    };
};

Login.propTypes = {
    findClient : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    conta : state.clients.conta,
    error : state.clients.error
});

export default connect(mapStateToProps, { findClient })(Login);