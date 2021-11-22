const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fieldname: String,
  originalname: {
    type: String,
    unique: true
  },
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  permissions: Boolean
})

module.exports = mongoose.model('file', fileSchema)