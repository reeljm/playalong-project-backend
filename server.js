const express = require('express');
const app = express();
const cors = require('cors');
const songs = require('./routes/songs');
var bodyParser = require('body-parser')
app.use(cors());
const fs = require('fs');
const https = require('https');

var privateKey = fs.readFileSync('./keys/key.pem');
var certificate = fs.readFileSync('./keys/cert.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3000);

const main = (async () => {






// connect to db:
const {MongoClient} = require('mongodb');
const uri = "mongodb://localhost:27017/playalong-project";
let client = new MongoClient(uri);
await client.connect();
const db = client.db("playalong-project");
app.set('db', db);

// configure middlewares:
app.use(bodyParser.json());

// configure routes:
app.use('/songs', songs);



})();
