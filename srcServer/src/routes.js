const contas_dao = require('./control/contas_dao');
const assert = require('assert');

const contas = new contas_dao.contas();

exports.getRoutes = (api) => {
    
    api.get('/contas', (req, res) => {
        
        try {

            contas.show((result) => {

                try{

                    assert.notEqual(undefined, result.results);
                    
                    var html = "<table>";
                    html +=    "    <thead>";
                    html +=    "        <tr>";
                    html +=    "            <th>";
                    html +=    "                Número da Conta";
                    html +=    "            </th>";
                    html +=    "            <th>";
                    html +=    "                Nome do cliente";
                    html +=    "            </th>";
                    html +=    "            <th>";
                    html +=    "                Tipo da Conta";
                    html +=    "            </th>";
                    html +=    "        </tr>";
                    html +=    "    </thead>";
                    html +=    "    <tbody>";
                    
                    result.results.map(row => {
                        html += "<tr><td>" + row.numero + "</td>";
                        html += "<td>" + row.cliente + "</td>";
                        html += "<td>" + row.tipo_cod + "</td></tr>";
                    });
                    
                    html += "</tbody></table>";

                    res.send(html);

                }catch (e){

                    res.sendStatus(404);

                }

            });

        }catch (e){

            res.sendStatus(404);

        }
        
    });
   
    api.post('/contas', (req, res) => {
        
        if(req.is('application/json')){
                
            try {

                contas.show((result) => {
                    
                    try{

                        assert.notEqual(undefined, result.results);

                        res.json({
                            clientes : result.results,
                            error : undefined
                        });
                        
                    }catch (e){
                        
                        res.json({
                            clientes : undefined,
                            error : result.error
                        });
                        
                    }

                });

            }catch (e){

                res.json({
                    contas : undefined,
                    error : e
                });

            }
            
        }else{
            res.sendStatus(404);
        }
        
    });
    
    api.post('/conta/find', (req, res) => {
        
        if(req.is('application/json')){
            
            try{
                
                req.body.number = parseInt(req.body.number);

                contas.find(
                    req.body.number, 
                    req.body.senha, 
                    (result) => {

                        try {

                            assert.notEqual(undefined, result.conta);

                            res.json({
                                conta : result.conta,
                                error : undefined,
                                exception : undefined
                            });

                        }catch (e){

                            res.json({
                                conta : undefined,
                                error : result.error,
                                exception : e
                            });

                        }

                    }
                );
        
            }catch (e){
                res.json({
                    conta : undefined,
                    error : e,
                    exception : undefined
                });
            }
            
        }else{
            res.sendStatus(404);
        }
        
    });
    
    api.post('/conta/new', (req, res) => {
        
        if(req.is('application/json')){
            
            try{
                
                req.body.number = parseInt(req.body.number);
            
                contas.init(
                    req.body, 
                    (result) => {

                        try {

                            assert.notEqual(undefined, result.conta);

                            res.json({
                                conta : result.conta,
                                error : undefined
                            });

                        }catch (e){

                            res.json({
                                conta : undefined,
                                error : result.error
                            });

                        }

                    }
                );
        
            }catch (e){
                res.json({
                    conta : undefined,
                    error : e
                });
            }
            
        }else{
            res.sendStatus(404);
        }
        
    });
    
    api.post('/conta/drop', (req, res) => {
        
        if(req.is('application/json')){
            
            try{
                
                req.body.number = parseInt(req.body.number);

                contas.drop(
                    req.body.number, 
                    req.body.senha, 
                    (results, fields) => {
                        
                        res.json({
                            results : results,
                            fields : fields,
                            error : undefined
                        });

                    },
                    (error) => {
                        
                        res.json({
                            results : undefined,
                            fields : undefined,
                            error : error
                        });

                    }
                );
        
            }catch (e){
                
                res.json({
                    results : undefined,
                    fields : undefined,
                    error : e
                });
            }
            
        }else{
            res.sendStatus(404);
        }
        
    });
    
    api.post('/conta/sacar', (req, res) => {
        
        if(req.is('application/json')){
            
            try{
                
                req.body.number = parseInt(req.body.number);
                req.body.valor = parseInt(req.body.valor);

                contas.sacar(
                    req.body.number, 
                    req.body.senha, 
                    req.body.valor, 
                    (conta, results, fields) => {

                        res.json({
                            conta : conta,
                            results : results,
                            fields : fields,
                            error : undefined
                        });

                    },
                    (error) => {

                        res.json({
                            conta : undefined,
                            results : undefined,
                            fields : undefined,
                            error : error
                        });

                    }
                );
        
            }catch (e){
                res.json({
                    conta : undefined,
                    results : undefined,
                    fields : undefined,
                    error : e
                });
            }
            
        }else{
            res.sendStatus(404);
        }
        
    });
    
    api.post('/conta/depositar', (req, res) => {
        
        if(req.is('application/json')){
            
            try{
                
                req.body.number = parseInt(req.body.number);
                req.body.valor = parseInt(req.body.valor);

                contas.depositar(
                    req.body.number, 
                    req.body.senha, 
                    req.body.valor, 
                    (conta, results, fields) => {

                        res.json({
                            conta : conta,
                            results : results,
                            fields : fields,
                            error : undefined
                        });

                    },
                    (error) => {

                        res.json({
                            results : undefined,
                            fields : undefined,
                            error : error
                        });

                    }
                );
        
            }catch (e){
                res.json({
                    results : undefined,
                    fields : undefined,
                    error : e
                });
            }
            
        }else{
            res.sendStatus(404);
        }
        
    });

    return api;
};
