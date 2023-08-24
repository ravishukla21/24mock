const mongoose = require("mongoose");
require("dotenv").config();
const connection = mongoose.connect(process.env.mongoURL);
//databasename
// mongodb://localhost:27017/google_notes
module.exports = { connection };
