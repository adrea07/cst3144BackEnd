const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://adrea18856_db_user:slimpitu2007@cluster0.vehldun.mongodb.net/'

const client = new MongoClient(uri);
async function testConnection() {
    try{
        await client.connect();
        console.log('Mongo db connected successfully');
        const db = client.db('webstore');
        console.log('database selected:', db.databaseName);
    } catch (error) {
        console.log('connection error:',error.message);

    } finally {
        await client.close();
    }
}
testConnection();