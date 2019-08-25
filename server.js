const express = require('express');
const app = express();

const mongoose = require('mongoose');

const cors = require('cors');

const bcrypt = require('bcrypt');

const path = require('path');
const history = require('connect-history-api-fallback');

const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

const bodyParser = require('body-parser');
const router = require('./routes/index.js');

const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));

app.use(staticFileMiddleware);
app.use(history({
  disableDotRule: true,
  verbose: true
}));
app.use(staticFileMiddleware);

//models
const Record = require('./Record');

//connect server to mongoDB
+mongoose.connect(
  mongoDbUri,
  {useNewUrlParser: true, useCreateIndex: true,}
);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(router);

// retrieves all the records
app.get('/api/record/list', (req, res) => {
  Record.find({}).sort({updatedAt: 'descending'}).exec((err, records) => {
    if (err) return res.status(404).send('Error while getting records!');
    return res.send({records});
  });
});

// create a new note
app.post('/api/record/create', (req, res) => {
  const note = new Record({body: req.body.body, title: req.body.title});
  note.save((err) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({note});
  });
});

// update an existing note with the given object id
app.post('/api/record/update/:id', (req, res) => {
  let options = {new: true};
  Record.findByIdAndUpdate(req.params.id, req.body.data, options, (err, record) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({message: 'record updated!', record});
  });
});

// delete an existing note with the given object id
app.post('/api/record/delete/:id', (req, res) => {
  Record.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.status(404).send({message: err.message});
    return res.send({message: 'record deleted!'});
  });
});

// app.get('/', function (req, res) {
//   res.render(path.join(__dirname + '/dist/index.html'));
// });

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
