import { CLIENT_LIST, FIND_CLIENT ,TO_WITHDRAW_CLIENT, DEPOSIT_CLIENT, DROP_CLIENT, NEW_CLIENT } from './types';

export const CORRENTE = 1;
export const POUPANCA = 2;
export const ESPECIAL = 3;

export const allClients = () => dispatch => {
    fetch("/contas", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        }
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : CLIENT_LIST,
            clientsList : content.clientes,
            error : content.error
        })
    );
};

export const newClient = (conta = {}) => dispatch => {
    fetch("/conta/new", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        },
        body : JSON.stringify(conta)
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : NEW_CLIENT,
            conta : content.conta,
            error : content.error            
        })
    );
};

export const findClient = (conta = {}) => dispatch => {
    fetch("/conta/find", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        },
        body : JSON.stringify(conta)
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : FIND_CLIENT,
            conta : content.conta,
            error : {
                error : content.error,
                exception : content.exception
            },            
        })
    );
};

export const dropClient = (conta = {}) => dispatch => {
    fetch("/conta/drop", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        },
        body : JSON.stringify(conta)
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : DROP_CLIENT,
            result : content.results,
            error : content.error           
        })
    );
};

export const toWithdrawClient = (conta = {}) => dispatch => {
    fetch("/conta/sacar", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        },
        body : JSON.stringify(conta)
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : TO_WITHDRAW_CLIENT,
            conta : content.conta,
            error : content.error
        })
    );
};

export const depositClient = (conta = {}) => dispatch => {
    fetch("/conta/depositar", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json; charset=utf-8',                  
        },
        body : JSON.stringify(conta)
    })
    .then(res => res.json())
    .then(content => 
        dispatch({
            type : DEPOSIT_CLIENT,
            conta : content.conta,
            error : content.error
        })
    );
};