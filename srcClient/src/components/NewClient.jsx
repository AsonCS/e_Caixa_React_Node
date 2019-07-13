import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { newClient, CORRENTE, POUPANCA, ESPECIAL } from '../actions/clientsActions';

class NewClient extends Component {
    state = {
        def_tax : 0.0005,
        def_limite : 1000,
        def_sal_limite : 0,
        tax : "collapse",
        limite : "collapse",
        sal_limite : "collapse"
    }
    
    onChange = (e) => {
        switch (parseInt(e.target.value)){
            case POUPANCA:
                this.refs.limite.value = this.state.def_limite;
                this.refs.sal_limite.value = this.state.def_sal_limite;
                this.setState({
                    tax : "visible",
                    limite : "collapse",
                    sal_limite : "collapse"
                });
                break;
            case ESPECIAL:
                this.refs.tax.value = this.state.def_tax;
                this.setState({
                    tax : "collapse",
                    limite : "visible",
                    sal_limite : "visible"
                });
                break;
            default:
                this.refs.tax.value = this.state.def_tax;
                this.refs.limite.value = this.state.def_limite;
                this.refs.sal_limite.value = this.state.def_sal_limite;
                this.setState({
                    tax : "collapse",
                    limite : "collapse",
                    sal_limite : "collapse"
                });
                break;
        }
    }
    
    handleClick(e) {
        e.preventDefault();
        const obj = {
            number : this.refs.numconta.value,
            cliente : this.refs.client.value,
            senha : this.refs.senha.value,
            tipo_cod : parseInt(this.refs.type.value),
            taxa : undefined,
            limite : undefined,
            saldo_trans : undefined
        };
        if(obj.tipo_cod === POUPANCA){
            obj.taxa = parseFloat(this.refs.tax.value);
        }else if(obj.tipo_cod === ESPECIAL){
            obj.limite = parseInt(this.refs.limite.value);
            obj.saldo_trans = parseInt(this.refs.sal_limite.value);
        }
        this.props.newClient(obj);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.conta){
            console.log(nextProps.conta);
            alert("Conta criada com sucesso...");
            window.history.replaceState(null, null, "/");
            window.location = "/";
        }else if(nextProps.error){
            console.log(nextProps.error);
            alert("Erro ao criar conta...");
        }
    }
    
    render() {
        
        return (
            <div className="App">
                <div className="App-header">
                    <div className="alert alert-success" role="alert">
                        Nova Conta
                    </div>

                    <form action="#" onSubmit = {(e) => this.handleClick(e)} id="form">
                        <table>
                            <tbody>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="client">Cliente: </label>
                                    </td>
                                    <td>
                                        <input ref="client" type="text" className="form-control" name="client" id="client" placeholder="Nome do cliente" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="numconta">Número: </label>
                                    </td>
                                    <td>
                                        <input ref="numconta" name="numconta" id="numconta" type="number" className="form-control" 
                                            placeholder="Número da conta" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="senha">Senha: </label>
                                    </td>
                                    <td>
                                        <input ref="senha" type="password" className="form-control" name="senha" id="senha" placeholder="Senha" required />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <label htmlFor="type">Tipo: </label>
                                    </td>
                                    <td>
                                        <select ref="type" name="type" id="type" onChange={ this.onChange }>
                                            <option value={ CORRENTE }>Conta Corrente Comum</option>
                                            <option value={ POUPANCA }>Conta Poupança</option>
                                            <option value={ ESPECIAL }>Conta Corrente Especial</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr style={{ visibility : this.state.tax }} >
                                    <td align="right">
                                        <label htmlFor="tax">Taxa de rendimento: </label>
                                    </td>
                                    <td>
                                        <input ref="tax" name="tax" id="tax" type="number" className="form-control" 
                                            placeholder="Taxa da poupança" defaultValue={ this.state.def_tax } step=".0001" required />
                                    </td>
                                </tr>
                                <tr style={{ visibility : this.state.limite }} >
                                    <td align="right">
                                        <label htmlFor="limite">Limite: </label>
                                    </td>
                                    <td>
                                        <input ref="limite" name="limite" id="limite" type="number" className="form-control" 
                                            placeholder="Limite da conta" defaultValue={ this.state.def_limite } required />
                                    </td>
                                </tr>
                                <tr style={{ visibility : this.state.sal_limite }} >
                                    <td align="right">
                                        <label htmlFor="sal_limite">Saldo do limite: </label>
                                    </td>
                                    <td>
                                        <input ref="sal_limite" name="sal_limite" id="sal_limite" type="number" className="form-control" 
                                            placeholder="Saldo de limite" defaultValue={ this.state.def_sal_limite } required />
                                    </td>
                                </tr>
                                <tr><td colSpan="2"><br/></td></tr>
                                <tr>
                                    <td colSpan="2">
                                        <button type="submit" className="btn btn-primary">Criar</button>
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

NewClient.propTypes = {
    newClient : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    conta : state.clients.conta,
    error : state.clients.error
});

export default connect(mapStateToProps, { newClient })(NewClient);