const {MongoClient} = require('mongodb');
const fs = require('fs').promises;
const dirname = "./json-files";

async function loadDB() {
    const uri = "mongodb://localhost:27017/playalong-project"
    let client = new MongoClient(uri);
    console.log("Connecting to DB...");
    await client.connect();
    const db = client.db("playalong-project");
    console.log("Successfully connected to DB");

    await db.collection('Song').deleteMany();

    const filenames = await fs.readdir(dirname);

    const promises = filenames.map(function(filename) {
        console.log("Uploading song  " + dirname + "/" + filename + " to DB");
        return new Promise(async (resolve, reject) => {
            try {
                const content = await fs.readFile(dirname + "/" + filename, 'utf-8');
                const data = JSON.parse(content);
                await db.collection('Song').insertOne(data);
                resolve();
            } catch (e) {
                console.log("   Failed to move " + dirname + "/" + filename);
                console.error(e);
                reject();
            }
        });
    });
    await Promise.all(promises);
    console.log("Finished uploading songs, closing DB connection");
    await client.close();
    console.log("DB connection succesfully closed");
}

loadDB();
