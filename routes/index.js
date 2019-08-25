var express = require('express')
    , router = module.exports = express.Router()
    , discogs = require('./discogs.js')
    , spotify = require('./spotify.js')
    , setlistfm = require('./setlistfm.js')
    , render_page = require('./render_page.js')
    , get_records = require('./get_records.js');

// router.route('/discogs').post(discogs.post);
// router.route('/spotify').post(spotify.post);
// router.route('/setlistfm').post(setlistfm.post);


router.route('/').get(render_page.get);
router.route('/api/record/list').get(get_records.get);
