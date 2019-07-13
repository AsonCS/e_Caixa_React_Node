import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { depositClient, toWithdrawClient, dropClient } from '../actions/clientsActions';

class Manipulate extends Component {
    
    state = {
        conta : undefined,
        client : "",
        extrato : "",
        senha : ""
    }
    
    out = () => {
        window.history.replaceState(null, null, "/");
        window.location = "/";
    }
    
    drop = (e) => {
        var input = e.target.parentNode.parentNode.firstChild.nextSibling.firstChild.nextSibling;
        const obj = {
            number : input.value,
            senha : input.nextSibling.nextSibling.value
        };
        if(this.state.senha === obj.senha && parseFloat(this.state.conta.number) === parseFloat(obj.number)){
            this.props.dropClient(obj);
        }else{
            console.log(obj);
            console.log(this.state.senha + " - " + this.state.conta.number);
            alert("Dados errados!!!");
        }
    }
    
    toWithdraw = (e) => {
        var value = e.target.parentNode.parentNode.firstChild.nextSibling.firstChild.value;
        this.props.toWithdrawClient({
            number : this.state.conta.number,
            senha : this.state.conta.senha,
            valor : value
        });
    }
    
    deposit = (e) => {
        var value = e.target.parentNode.parentNode.firstChild.nextSibling.firstChild.value;
        this.props.depositClient({
            number : this.state.conta.number,
            senha : this.state.conta.senha,
            valor : value
        });
    }
    
    componentWillMount() {
        if (!this.props.location.state){
            window.history.replaceState(null, null, "/");
            window.location = "/";
            return;
        }
        this.setState({
            conta : this.props.location.state.conta,
            senha : this.props.location.state.conta.senha
        });
        delete this.props.location.state;
        window.history.replaceState(null, null, "/");
    }
    
    componentDidMount(){
        if(this.state.conta){
            if(!this.state.conta.limite){
                this.setState({
                    client : this.state.conta.cliente,
                    extrato : this.state.conta.saldo
                });
            }else{
                const limite = parseInt(this.state.conta.limite);
                const saldo = parseInt(this.state.conta.saldo);
                if(saldo > 0){
                    this.setState({
                        client : this.state.conta.cliente,
                        extrato : saldo + "<br>limite: " + limite
                    });
                }else{
                    this.setState({
                        client : this.state.conta.cliente,
                        extrato : "0<br>limite: " + (limite + saldo)
                    });
                }
            }
        }
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.conta){
            nextProps.conta.senha = this.state.senha;
            if(!nextProps.conta.limite){
                this.setState({
                    conta : nextProps.conta,
                    client : nextProps.conta.cliente,
                    extrato : nextProps.conta.saldo
                });
            }else{
                const limite = parseInt(nextProps.conta.limite);
                const saldo = parseInt(nextProps.conta.saldo);
                if(saldo > 0){
                    this.setState({
                        conta : nextProps.conta,
                        client : nextProps.conta.cliente,
                        extrato : saldo + "<br>limite: " + limite
                    });
                }else{
                    this.setState({
                        conta : nextProps.conta,
                        client : nextProps.conta.cliente,
                        extrato : "0<br>limite: " + (limite + saldo)
                    });
                }
            }
        }else if(nextProps.error){
            console.log(nextProps.error);
            alert("Erro na operação...");
        }else if(nextProps.result){
            if(parseInt(nextProps.result.affectedRows) === 1){
                alert("Deletado com sucesso!!!");
            }else{
                alert("Deletado, com problemas!!!");
            }
            console.log(nextProps);
            window.history.replaceState(null, null, "/");
            window.location = "/";
        }
    }
    
    render() {
        
        if (!this.state.conta){
            window.history.replaceState(null, null, "/");
            return <Redirect push to="/" />;
        }
        
        return (
            <div className="App">
                <div className="App-header">
                    <div className="alert alert-info" role="alert">
                        Olá: { this.state.client }
                    </div>
                    <div className="alert alert-warning" role="alert">
                    Seu extrato é: <span dangerouslySetInnerHTML={{__html: this.state.extrato}}></span>
                    </div>
                    <div className="btn-group btn-group-lg" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#depositar">Depositar</button>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#sacar">Sacar</button>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#drop">Apagar</button>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#sair">Sair</button>
                    </div>                        
                </div>
                <Depositar deposit={ this.deposit }/>
                <Sacar toWithdraw={ this.toWithdraw }/>
                <Apagar drop={ this.drop }/>
                <Sair out={ this.out }/>
            </div>
        );
    };
};

let Depositar = ({ deposit }) => {
    return (
        <div className="modal fade" id="depositar" tabIndex="-1" role="dialog" aria-labelledby="depositarLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="depositarLabel">Deposito</h5>
                    </div>
                    <div className="modal-body">
                        <input type="number" id="val_dep" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={ deposit } data-dismiss="modal">Depositar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

let Sacar = ({ toWithdraw }) => {
    return (
        <div className="modal fade" id="sacar" tabIndex="-1" role="dialog" aria-labelledby="sacarLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="sacarLabel">Saque</h5>
                    </div>
                    <div className="modal-body">
                        <input type="number" id="val_saque" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={ toWithdraw } data-dismiss="modal">Sacar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

let Apagar = ({ drop }) => {
    return (
        <div className="modal fade" id="drop" tabIndex="-1" role="dialog" aria-labelledby="sairLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="dropLabel">Deseja apagar a conta?</h5>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="numero_conta">Numero da conta: </label><input type="number" id="numero_conta" />
                        <label htmlFor="senha_conta">Senha da conta: </label><input type="text" id="senha_conta" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={ drop } data-dismiss="modal">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

let Sair = ({ out }) => {
    return (
        <div className="modal fade" id="sair" tabIndex="-1" role="dialog" aria-labelledby="sairLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="sairLabel">Deseja sair?</h5>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Não</button>
                        <button type="button" className="btn btn-primary" onClick={ out } data-dismiss="modal">Sim</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

Manipulate.propTypes = {
    depositClient : PropTypes.func.isRequired,
    toWithdrawClient : PropTypes.func.isRequired,
    dropClient : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    conta : state.clients.conta,
    result : state.clients.result,
    error : state.clients.error
});

export default connect(mapStateToProps, { depositClient, toWithdrawClient, dropClient })(Manipulate);