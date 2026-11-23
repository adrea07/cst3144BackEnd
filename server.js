const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');

const app = express();
app.use(express.json());
app.set('port',6001);

const uri = 'mongodb+srv://adrea18856_db_user:slimpitu2007@cluster0.vehldun.mongodb.net/'

const client = new MongoClient(uri);
let db;
async function startServer() {
    try{
        await client.connect();
        console.log('connected successfully to MongoDB');
        db = client.db('webstore'); //table name

        //start root path
        app.get('/',(req,res) => {
            res.send('Select a collection, eg- /collection/messages');
        });

        app.param('collectionName', (req,res,next,collectionName) => {
            req.collection = db.collection(collectionName);
            next();
        });
        //retrieve all records of table
        app.get('.collection/:collectionName', async (req,res,next) => {
            try {
                const results = await req.collection.find({}).toArray();
                res.send(results);
            } catch (err) {
                next(err);
            }
        });
        //insert new object
        app.post('/collection/:collectionName',async (req,res,next) => {
            try {
                const results = await req.collection.insertOne(req.body);
                res.status(201).send({
                    msg: 'success',
                    insertedId: results.insertedId
                });
            } catch (err) {
                next(err);
            }
        });
        //get object using its object id
        app.get('/collection/:collectionName/:id', async (req,res,next) => {
            try{
                if (!ObjectId.isValid(req.params.id)) {
                    return res.status(400).send({ msg: 'Invalid Output'});
                }
                const result = await req.collection.findOne({
                    _id: new ObjectId(req.params.id)
                });
                res.send(result);
            } catch (err) {
                next(err);
            }
        });
        //update one object using its object id
        app.put('/collection/:collectionName/:id', async (req,res,next) => {
            try{
                if (!ObjectId.isValid(req.params.id)) {
                    return res.status(400).send({ msg: 'Invalid object id'});
                }
                const result = await req.collection.updateOne(
                    {_id: new ObjectId(req.params.id)},
                    { $set: req.body}
                );
                res.send(result.matchedCount === 1 ? { msg: 'success'} : { msg: 'error'});
            } catch (err) {
                next(err);
            }
        });

    } catch (error) {
        console.log('mongo db connection error:',error.message);
    }
}
startServer();