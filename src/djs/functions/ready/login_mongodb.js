const mongoose = require('mongoose');

async function login_mongodb(client, token){

  const db = mongoose.connection;
db.on("error", () => {
  client.connectedToMongoose = false;
  console.error.bind(console, "connection error:")
  
});
db.once("open", () => {
  console.log("Connected to MongoDB")
  client.connectedToMongoose = true;
});
  if (mongoose === undefined) {
    return;
  } else {
    try{
    await mongoose.connect(token)
    console.log(`---------- >> MongoDB is Online << ----------`)
    client.connectedToMongoose = true;
  }catch(error){
    client.connectedToMongoose = false;
      console.log(error)
    } 
    
  }
}


module.exports = {
    login_mongodb
};