class Conta {
    
    static CORRENTE () { return 1; }
    static POUPANCA () { return 2; }
    static ESPECIAL () { return 3; }
    
    constructor(number, cliente, senha, tipo_cod = Conta.CORRENTE()) {
        this.number = number;
        this.saldo = 0;
        this.cliente = cliente;
        this.senha = senha;
        this.tipo_cod = tipo_cod;
        
        this.sacar = (valor) => {
            if (valor <= this.saldo) {
                this.saldo -= valor;
                return true;
            }else{
                return false;
            }
        };
        
        this.depositar = (valor) => {
            if (valor >= 0) {
                this.saldo += valor;
                return true;
            }else{
                return false;
            }
        };
    
        this.saldoString = () => {
            return JSON.stringify(this);
        };
    }
}

class Poupanca extends Conta {
    constructor(number, cliente, senha, taxa) {
        super(number, cliente, senha, Conta.POUPANCA());
        this.taxa = taxa;
    }
}

class Corrente extends Conta {
    constructor(number, cliente, senha) {
        super(number, cliente, senha, Conta.CORRENTE());  
    }
}

class Especial extends Conta {
    constructor(number, cliente, senha, limite, saldo_trans) {
        super(number, cliente, senha, Conta.ESPECIAL());
        this.limite = limite;
        this.saldo_trans = saldo_trans;
        this.sacar = (valor) => {
            if(this.saldo - valor < this.limite * -1){
                return false;
            }else{
                this.saldo -= valor;
                return true;
            }
        };   
    }
}
    
encrypt = (str) => {
    var encrypted = "";
    [].map.call(str, x => {return x;}).map(word => {
        encrypted += String.fromCharCode(parseInt(word.charCodeAt(0)) + 3);
    });
    return encrypted;
};

decrypt = (str) => {
    var decrypted = "";
    [].map.call(str, x => {return x;}).map(word => {
        decrypted += String.fromCharCode(parseInt(word.charCodeAt(0)) - 3);
    });
    return decrypted;
};

module.exports = {
    Poupanca : Poupanca,
    Corrente : Corrente,
    Especial : Especial,
    CORRENTE : Conta.CORRENTE(),
    POUPANCA : Conta.POUPANCA(),
    ESPECIAL : Conta.ESPECIAL(),
    encrypt : encrypt,
    decrypt : decrypt
};