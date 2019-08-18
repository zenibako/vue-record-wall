<template>
  <div id="app">
    <div class="records">
      <button v-on:click="fetchRecordData">GET BEAUTIFUL ARTWORK</button>
      <div>
        <div v-for="record in records">
          <img v-bind:src="record.imageUrl">
          <div>
            {{ record.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                token: 'VUepyybcatMhKAEXHglQvvyvUsbBuRLPNIvymfdK',
                consumerKey: 'qbFjUPJhAePbfQdqxuzG',
                consumerSecret: 'vaThtTnxAAbRZBSpMEzaOpYcbtWrQeTa',
                testRelease: 176126,
                records: [],
                tracklist: []
            }
        },

        methods: {
            fetchRecordData: function (event) {
                this.getCollectionForUser('chanderson90', this.setDataFromDiscogs);
            },
            getReleaseFromDiscogs: function (releaseId, callback) {
                var Discogs = require('disconnect').Client;
                var db = new Discogs().database();
                return db.getRelease(releaseId, callback);
            },
            getCollectionForUser: function (username, callback) {
                var Discogs = require('disconnect').Client;
                var col = new Discogs({userToken: this.token}).user().collection();
                return col.getReleases(username, 0, {page: 1, per_page: 9999}, callback);
            },
            setDataFromDiscogs: function (err, data) {
                console.log(data);
                var releases = data.releases;
                if (releases) {
                    var records = [];
                    releases.forEach(function (release) {
                        var record = {
                            title: release.basic_information.title,
                            year: release.basic_information.year,
                            imageUrl: release.basic_information.cover_image
                        };
                        records.push(record);
                    });
                    this.records = records;
                }
                //this.recordData
                //this.tracklist = data.tracklist;
            },
        }
    }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
