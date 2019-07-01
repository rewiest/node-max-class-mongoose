const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

// method for connecting and storing (keeping alive) connection
// MongoDB will automatically handle the pooling of connections for simultaneous needs
const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://lioncrazed:wrpnst1!@cluster0-ef34a.mongodb.net/shop?retryWrites=true&w=majority', 
    { useNewUrlParser: true }
  )
  .then(client => {
    console.log('Database Connected!');
    db = client.db();
  callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
}

// method for getting access to the existing connection (if it exists)
const getDb = () => {
  if (db) {
    return db;
  }
  throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
