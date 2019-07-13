const contas = require('../models/contas');
const db = require('./bd_interface');
const assert = require('assert');

class ContasDAO {
    
    constructor(){
        this.conta = undefined;
    
        /*
         * 
         * @returns {Object} result : {results, fields, error}
         */
        this.show = (callback = (result) => {}) => {

            db.query("SELECT numero, cliente, tipo_cod FROM contas", (results, fields) => {
                
                callback({
                    results : results,
                    fields : fields,
                    error : undefined
                });

            }, (error) => {
                callback({
                    results : undefined,
                    fields : undefined,
                    error : error
                });
            });

        };
    
        /*
         * 
         * @returns {Object} result : {conta, error}
         */
        this.find = (number, senha, callback = (result) => {}) => {

            assert.equal('number', typeof(number));
            assert.equal('string', typeof(senha));

            senha = contas.encrypt(senha);
            
            var sql = "SELECT ";
            sql +=    "C.numero AS numero, cliente, saldo, tipo_cod, taxa, limite, saldo_trans ";
            sql +=    "FROM contas C ";
            sql +=    "LEFT JOIN poupancas P ON (C.numero = P.numero) ";
            sql +=    "LEFT JOIN especiais E ON (C.numero = E.numero) ";
            sql +=    "WHERE C.numero = ? AND senha = ? ";

            db.query(
                sql, 
                [number, senha], 
                (results, fields) => {

                    var result = results[0];
                    
                    if(typeof(result) === 'undefined'){
                        callback({
                            conta : undefined,
                            error : undefined
                        });
                    }else{
                    
                        switch (result.tipo_cod){
                            case contas.CORRENTE:
                                this.conta = new contas.Corrente(result.numero, result.cliente, undefined);
                                this.conta.saldo = result.saldo;
                                break;
                            case contas.POUPANCA:
                                this.conta = new contas.Poupanca(result.numero, result.cliente, undefined, result.taxa);
                                this.conta.saldo = result.saldo;
                                break;
                            case contas.ESPECIAL:
                                this.conta = new contas.Especial(result.numero, result.cliente, undefined, result.limite, result.saldo_trans);
                                this.conta.saldo = result.saldo;
                                break;
                            default:
                                this.conta = undefined;
                                break;
                        }

                        callback({
                            conta : this.conta,
                            error : undefined
                        });

                    }

                }, 
                (error) => {
                    callback({
                        conta : undefined,
                        error : error
                    });
                }
            );

        };
    
        /*
         * 
         * @returns {Object} result : {conta, error}
         */
        this.init = (conta, callback = (result) => {}) => {

            assert.equal('object', typeof(conta));
            assert.equal('number', typeof(conta.tipo_cod));
            assert.equal('number', typeof(conta.number));
            assert.equal('string', typeof(conta.cliente));
            assert.equal('string', typeof(conta.senha));

            this.conta = undefined;

            switch (conta.tipo_cod){
                case contas.CORRENTE:
                    this.conta = new contas.Corrente(conta.number, conta.cliente, conta.senha);
                    this.conta.senha = contas.encrypt(conta.senha);
                    db.query(
                            "INSERT INTO contas VALUES (?, ?, ?, 0, ?)", 
                            [this.conta.number, this.conta.cliente, this.conta.senha, this.conta.tipo_cod],
                            (results, fields) => {
                                callback({
                                    conta : this.conta,
                                    error : undefined
                                });
                            }, 
                            (error) => {
                                callback({
                                    conta : undefined,
                                    error : error
                                });
                            }
                    );
                    break;
                case contas.POUPANCA:
                    this.conta = new contas.Poupanca(conta.number, conta.cliente, conta.senha, conta.taxa);
                    this.conta.senha = contas.encrypt(conta.senha);

                    db.transaction(
                        (conn) => {
                            conn.query(
                                "INSERT INTO contas VALUES (?, ?, ?, 0, ?)", 
                                [this.conta.number, this.conta.cliente, this.conta.senha, this.conta.tipo_cod],
                                (error, results, fields) => {
                                    if (error) {
                                        callback({
                                            conta : undefined,
                                            error : error
                                        });
                                        conn.release();
                                    }else{
                                        var sql = "";
                                        var args = [];
                                        if('number' === typeof(this.conta.taxa)){
                                            sql = "INSERT INTO poupancas VALUES (?, ?)";
                                            args = [this.conta.number, this.conta.taxa];
                                        }else{
                                            sql = "INSERT INTO poupancas VALUES (?, DEFAULT)";
                                            args = [this.conta.number];
                                        }

                                        conn.query(
                                            sql, 
                                            args,
                                            (error, results, fields) => {
                                                if (error) {
                                                    callback({
                                                        conta : undefined,
                                                        error : error
                                                    });
                                                }else{
                                                    callback({
                                                        conta : this.conta,
                                                        error : undefined
                                                    });
                                                }
                                                conn.release();
                                            }
                                        );
                                    }
                                }
                            );
                        }, 
                        (error) => {
                            callback({
                                conta : undefined,
                                error : error
                            });
                        }
                    );

                    break;
                case contas.ESPECIAL:
                    this.conta = new contas.Especial(conta.number, conta.cliente, conta.senha, conta.limite, conta.saldo_trans);
                    this.conta.senha = contas.encrypt(conta.senha);

                    db.transaction(
                        (conn) => {
                            conn.query(
                                "INSERT INTO contas VALUES (?, ?, ?, 0, ?)", 
                                [this.conta.number, this.conta.cliente, this.conta.senha, this.conta.tipo_cod],
                                (error, results, fields) => {
                                    if (error) {
                                        callback({
                                            conta : undefined,
                                            error : error
                                        });
                                        conn.release();
                                    }else{
                                        var sql = "";
                                        var args = [];
                                        if('number' === typeof(this.conta.limite) && 'number' === typeof(this.conta.saldo_trans)){
                                            sql = "INSERT INTO especiais VALUES (?, ?, ?)";
                                            args = [this.conta.number, this.conta.limite, this.conta.saldo_trans];
                                        }else if('number' === typeof(this.conta.limite)){
                                            sql = "INSERT INTO especiais VALUES (?, ?, DEFAULT)";
                                            args = [this.conta.number, this.conta.limite];
                                        }else if('number' === typeof(this.conta.saldo_trans)){
                                            sql = "INSERT INTO especiais VALUES (?, DEFAULT, ?)";
                                            args = [this.conta.number, this.conta.saldo_trans];
                                        }else{
                                            sql = "INSERT INTO especiais VALUES (?, DEFAULT, DEFAULT)";
                                            args = [this.conta.number];
                                        }

                                        conn.query(
                                            sql, 
                                            args,
                                            (error, results, fields) => {
                                                if (error) {
                                                    callback({
                                                        conta : undefined,
                                                        error : error
                                                    });
                                                }else{
                                                    callback({
                                                        conta : this.conta,
                                                        error : undefined
                                                    });
                                                }
                                                conn.release();
                                            }
                                        );
                                    }
                                }
                            );
                        }, 
                        (error) => {
                            callback({
                                conta : undefined,
                                error : error
                            });
                        }
                    );        
                    break;
                default:
                    callback({
                        conta : undefined,
                        error : undefined
                    });
            }

        };

        this.drop = (number, senha, sucess_callback = (results, fields) => {}, error_callback = (error) => {}) => {

            assert.equal('number', typeof(number));
            assert.equal('string', typeof(senha));
            assert.equal('function', typeof(sucess_callback));
            assert.equal('function', typeof(error_callback));

            this.find(number, senha, (result) => {
                
                var conta = result.conta;

                try{
                
                    assert.notEqual(undefined, conta);

                    conta.senha = contas.encrypt(senha);

                    switch (conta.tipo_cod){
                        case contas.CORRENTE:
                            db.query(
                                    "DELETE FROM contas WHERE numero = ? AND senha = ?", 
                                    [conta.number, conta.senha],
                                    (results, fields) => {
                                        sucess_callback(results, fields);
                                    }, 
                                    (error) => {
                                        error_callback(error);
                                    }
                            );
                            break;
                        case contas.POUPANCA:

                            db.transaction(
                                (conn) => {
                                    conn.query(
                                        "DELETE FROM poupancas WHERE numero = ?", 
                                        [conta.number],
                                        (error, results, fields) => {
                                            if (error) {
                                                error_callback(error);
                                                conn.release();
                                            }else{
                                                conn.query(
                                                    "DELETE FROM contas WHERE numero = ? AND senha = ?", 
                                                    [conta.number, conta.senha],
                                                    (error, results, fields) => {
                                                        if (error) {
                                                            error_callback(error);
                                                        }else{
                                                            sucess_callback(results, fields);
                                                        }
                                                        conn.release();
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }, 
                                (error) => {
                                    error_callback(error);
                                }
                            );

                            break;
                        case contas.ESPECIAL:

                            db.transaction(
                                (conn) => {
                                    conn.query(
                                        "DELETE FROM especiais WHERE numero = ?", 
                                        [conta.number],
                                        (error, results, fields) => {
                                            if (error) {
                                                error_callback(error);
                                                conn.release();
                                            }else{
                                                conn.query(
                                                    "DELETE FROM contas WHERE numero = ? AND senha = ?", 
                                                    [conta.number, conta.senha],
                                                    (error, results, fields) => {
                                                        if (error) {
                                                            error_callback(error);
                                                        }else{
                                                            sucess_callback(results, fields);
                                                        }
                                                        conn.release();
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }, 
                                (error) => {
                                    error_callback(error);
                                }
                            );

                            break;
                        default:
                            error_callback({
                                error : "Type not found"
                            });
                            break;
                    }
                    
                }catch (e){
                    error_callback(e);
                }

            });

        };

        this.sacar = (number, senha, valor, sucess_callback = (conta, results, fields) => {}, error_callback = (error) => {}) => {

            assert.equal('number', typeof(number));
            assert.equal('string', typeof(senha));
            assert.equal('number', typeof(valor));
            assert.equal('function', typeof(sucess_callback));
            assert.equal('function', typeof(error_callback));

            this.find(number, senha, (result) => {
                
                var conta = result.conta;
                
                try{
                
                    assert.notEqual(undefined, conta);

                    conta.senha = contas.encrypt(senha);

                    if(!conta.sacar(valor)){
                        error_callback({
                            error : "Valor invalido."
                        });
                    }else{

                        db.query(
                            "UPDATE contas SET saldo = ? WHERE numero = ? AND senha = ?", 
                            [conta.saldo, conta.number, conta.senha],
                            (results, fields) => {
                                delete conta.senha;
                                sucess_callback(conta, results, fields);
                            }, 
                            (error) => {
                                error_callback(error);
                            }
                        );

                    }
                    
                }catch (e){
                    error_callback(e);
                }

            });

        };

        this.depositar = (number, senha, valor, sucess_callback = (conta, results, fields) => {}, error_callback = (error) => {}) => {

            assert.equal('number', typeof(number));
            assert.equal('string', typeof(senha));
            assert.equal('number', typeof(valor));
            assert.equal('function', typeof(sucess_callback));
            assert.equal('function', typeof(error_callback));

            this.find(number, senha, (result) => {
                
                var conta = result.conta;

                try{
                    
                    assert.notEqual(undefined, conta);
                
                    conta.senha = contas.encrypt(senha);

                    if(!conta.depositar(valor)){
                        error_callback({
                            error : "Valor invalido."
                        });
                    }else{

                        db.query(
                            "UPDATE contas SET saldo = ? WHERE numero = ? AND senha = ?", 
                            [conta.saldo, conta.number, conta.senha],
                            (results, fields) => {
                                delete conta.senha;
                                sucess_callback(conta, results, fields);
                            }, 
                            (error) => {
                                error_callback(error);
                            }
                        );

                    }
                
                }catch (e){
                    error_callback(e);
                }

            });

        };
        
    }
    
}

module.exports = {
    contas : ContasDAO
};