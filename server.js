const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())

app.listen(3000, async function() {
    console.log('listening on 3000');
    const {MongoClient} = require('mongodb');
    const uri = "mongodb://localhost:27017/playalong-project";
    let client = new MongoClient(uri);

    await client.connect();
    const db = client.db("playalong-project");

    app.get('/', async (req, res) => {
        const songs = db.collection('Song');
        const data = await songs.findOne({name: "There Will Never Be Another You"});
        res.send(data);
    });
});
