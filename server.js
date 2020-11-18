const express = require('express');
const app = express();
const cors = require('cors');
const songs = require('./routes/songs');
var bodyParser = require('body-parser')
app.use(cors());

app.listen(3000, async function() {
    console.log('listening on 3000');

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
});

