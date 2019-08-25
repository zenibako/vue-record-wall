const username = 'chanderson90';
const userToken = process.env.DISCOGS_TOKEN;

exports.get = function (req, res) {
  if (username) {
    getCollectionForUser(username, setDataFromDiscogs);
  } else {
    console.log('No username provided.');
  }

  function getReleaseFromDiscogs (releaseId, callback) {
    var Discogs = require('disconnect').Client;
    var db = new Discogs().database();
    return db.getRelease(releaseId, callback);
  }

  function getCollectionForUser(username, callback) {
    console.log("Get collection for username " + username + "...");
    var Discogs = require('disconnect').Client;
    var col = new Discogs({userToken: userToken}).user().collection();
    return col.getReleases(username, 0, {page: 1, per_page: 9999}, callback);
  }

  function setDataFromDiscogs(err, data) {
    console.log("Discogs data returned:");
    console.log(data);
    var releases = data.releases;
    if (releases) {
      var records = [];
      releases.forEach(function (release) {
        var record = {
          id: release.id,
          title: release.basic_information.title,
          year: release.basic_information.year,
          imageUrl: release.basic_information.cover_image,
          artists: release.basic_information.artists,
          dateAdded: release.date_added,
          notes: release.notes
        };
        records.push(record);
      });
      res.json({records: records});
    }
  }
}
