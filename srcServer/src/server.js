const assert = require('assert');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

var app = express();

app.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(bodyParser.json());

app = routes.getRoutes(app);

app.post('/*', (req, res) => {res.sendStatus(404)});

const server = app.listen(5000, () => console.log("listening at: http://%s:%s", server.address().address, server.address().port));
