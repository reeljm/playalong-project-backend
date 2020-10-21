const express = require('express');
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();

// another you
// http://localhost:3000/songs/5f8e5afbe583a92a8c7bb179

router.get('/id/:songId', async (req, res) => {
	const db = req.app.get("db");
	const songs = db.collection('Song');
	const o_id = new ObjectId(req.params.songId);
	const data = await songs.findOne({_id: o_id});
	res.send(data);
});

router.get('/', async (req, res) => {
	const db = req.app.get("db");
	const songs = db.collection('Song');
	const data = await songs.find({}, { projection: { _id: 1, name: 1} }).sort({"name":1}).toArray();
	res.send(data);
});

module.exports = router