var express = require('express')
    , router = module.exports = express.Router()
    , discogs = require('./discogs.js')
    , spotify = require('./spotify.js')
    , setlistfm = require('./setlistfm.js');

// router.route('/discogs').post(discogs.post);
// router.route('/spotify').post(spotify.post);
// router.route('/setlistfm').post(setlistfm.post);
