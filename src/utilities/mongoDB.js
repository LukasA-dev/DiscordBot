const { MongoClient } = require("mongodb");


// Connect to MongoDB
async function connectToMongo() {
  const uri = process.env.MONGO_URI;
  const clientDB = new MongoClient(uri);

  try {
    await clientDB.connect();
    console.log("Connected to MongoDB");
    return clientDB.db("discordBot");
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process if the database connection fails
  }
}

module.exports = { connectToMongo };