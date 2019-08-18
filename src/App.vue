<template>
  <div id="app">
    <b-navbar type="light" variant="light">
      <b-nav-form>
        <b-form-input v-model.trim="searchInput" class="mr-sm-2" placeholder="Search"></b-form-input>
      </b-nav-form>
    </b-navbar>

    <div class="records" v-if="allRecords.length > 0">
      <b-container fluid class="bv-example-row">
        <b-row no-gutters>
          <b-col v-bind:sm="recordColWidth" v-for="record in viewRecords" v-bind:key="record.id">
            <b-img fluid-grow v-bind:src="record.imageUrl"></b-img>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else>
      <div class="d-flex justify-content-center mb-3">
        <b-spinner variant="primary" label="Spinning"></b-spinner>
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
                allRecords: [],
                tracklist: [],
                searchInput: '',
                recordColWidth: 3
            }
        },
        computed: {
            viewRecords: function () {
                var newViewRecords = [];
                console.log("Input length is " + this.searchInput.length);
                if (this.searchInput.length > 0) {
                    var filterText = this.searchInput.toUpperCase();
                    newViewRecords = this.allRecords.filter(function (record) {
                        var searchTextArray = [];
                        searchTextArray.push(record.title);
                        record.artists.forEach(function (artist) {
                            searchTextArray.push(artist.name);
                        });
                        var textToSearch = searchTextArray.join('|').toUpperCase();
                        //console.log("Searching for " + filterText + " in:");
                        //console.log(textToSearch);
                        return textToSearch.indexOf(filterText) > -1;
                    });
                    console.log("Found " + newViewRecords.length + " records for " + filterText + "!");
                    //console.log("Records filtered for " + this.searchInput + ":");
                    //console.log(newViewRecords);
                } else {
                    newViewRecords = this.allRecords;
                    console.log("No filter input, so no search");
                }
                return newViewRecords;
            }
        },
        mounted() {
            this.fetchRecordData();
        },
        methods: {
            fetchRecordData: function () {
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
                            artists: release.basic_information.artists
                        };
                        records.push(record);
                    });
                    this.allRecords = records;
                }
            }
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

  .container-fluid {
    padding-left: 0;
    padding-right: 0;
  }

  .col { border: 1px solid transparent; }
</style>
