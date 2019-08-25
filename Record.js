const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = Schema(

  {
    discogsId: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    year: {type: Number},
    imageUrl: {type: String},
    artists: {type: Array},
    dateAdded: {type: String},
    notes: {type: String}
  },

  { timestamps: true }

);

const Record = mongoose.model("Record", RecordSchema);

module.exports = Record;
