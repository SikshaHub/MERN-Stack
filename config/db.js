const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

/** Connect with MongoDB server using Monngoose
 *  We use Sync Await funcnionality of Javascript for getting responses
 *  This will give us promise
 *  Async Await is the new Standard to get API
 *  Create Asyncronous Arrow function connectDB
 *  Since mongoose.connect returns a promise, therefore we add await before function
 *  UseNewUrlParser is used bcoz old parser is deprecated in future versions    */
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    /** Exit process with failure */
    process.exit(1);
  }
};

module.exports = connectDB;
