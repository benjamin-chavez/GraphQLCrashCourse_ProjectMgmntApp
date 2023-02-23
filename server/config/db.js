const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;

// const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongoURI');

// // mongoose.connect(db)
// const connectDB = async () => {
//   try {
//     await mongoose.connect(db);

//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.log(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
