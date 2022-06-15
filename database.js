import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://h:${process.env.mongo}@openbotlist.nnf8e.mongodb.net/?retryWrites=true&w=majority`;

// To ppl who is self hosting obl - set process.env.mongo to your mongo atlas cluster password.

const client = new MongoClient(uri);

await client.connect();

export default client.db('obl');
