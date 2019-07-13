const mysql = require('mysql');
const assert = require('assert');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'e_contas',
    port     : 3306
});

var query = (sql, args = [], sucess_callback = (results, fields) => {}, error_callback = (error) => {}) => {

    assert.equal('string', typeof(sql));
    
    if(typeof(args) === 'object'){
        if(args.length > 0){
            
            pool.query(sql, args, (error, results, fields) => {
                if(error){
                    error_callback(error);
                }else{
                    sucess_callback(results, fields);
                }
            });
            
        }else{
            
            pool.query(sql, (error, results, fields) => {
                if(error){
                    error_callback(error);
                }else{
                    sucess_callback(results, fields);
                }
            });
            
        }
    }else{
        
        assert.equal('function', typeof(args));
        assert.equal('function', typeof(sucess_callback));
        
        error_callback = sucess_callback;
        sucess_callback = args;
        
        pool.query(sql, (error, results, fields) => {
            if(error){
                error_callback(error);
            }else{
                sucess_callback(results, fields);
            }
        });
        
    }
    
    
};

var transaction = (querys = (conn) => {}, error_callback = (error) => {}) => {
    pool.getConnection((error, conn) => {

        assert.equal('function', typeof(querys));
        assert.equal('function', typeof(error_callback));
        
        if(error){
            error_callback(error);
        }else{
            querys(conn);
        }
    });
};

module.exports = {
    query : query,
    transaction : transaction
};