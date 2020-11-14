const {MongoClient} = require('mongodb');
const fs = require('fs').promises;
const dirname = "./json-files";

async function main() {
    const uri = "mongodb://localhost:27017/playalong-project"
    let client = new MongoClient(uri);
    await client.connect();
    const db = client.db("playalong-project");

    await db.collection('Song').deleteMany();

    const filenames = await fs.readdir(dirname);

    filenames.forEach(async function(filename) {
        const content = await fs.readFile(dirname + "/" + filename, 'utf-8');
        const data = JSON.parse(content);
        try {
            await db.collection('Song').insertOne(data);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });
}

main().catch(console.error);
