<template>
  <div id="app">
    <b-navbar toggleable="lg" fixed="top" type="light" variant="light">
      <b-navbar-brand href="#">My Record Wall</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="pr-3">
            <b-form-group>
              <b-form-radio-group
                id="btn-radios-1"
                v-model="sortDirection"
                :options="sortDirectionOptions"
                buttons
                name="radios-btn-default">
              </b-form-radio-group>
            </b-form-group>
          </b-nav-form>
          <b-nav-form class="pr-3">
            <b-form-group>
              <b-form-radio-group
                id="btn-radios-2"
                v-model="sortCriteria"
                :options="sortCriteriaOptions"
                buttons
                name="radios-btn-default">
              </b-form-radio-group>
            </b-form-group>
          </b-nav-form>
        </b-navbar-nav>

        <b-nav-form class="">
          <b-form-input v-model.trim="searchInput" class="mr-sm-2" placeholder="Search Artist/Album..."></b-form-input>
        </b-nav-form>
      </b-collapse>
    </b-navbar>

    <div class="records" v-if="allRecords.length > 0">
      <b-container fluid class="wide-container">
        <b-row no-gutters>
          <b-col sm="3" v-for="record in viewRecords" v-bind:key="record.id">
            <RecordTile v-bind:record="record"></RecordTile>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center">
      <b-spinner variant="primary" label="Spinning"></b-spinner>
    </div>
  </div>
</template>

<script>
    import RecordTile from "./RecordTile";
    export default {
        name: 'app',
        components: {RecordTile},
        data() {
            return {
                token: 'VUepyybcatMhKAEXHglQvvyvUsbBuRLPNIvymfdK',
                consumerKey: '',
                consumerSecret: '',
                allRecords: [],
                searchInput: '',
                sortCriteria: 'artist',
                sortCriteriaOptions: [
                    { text: 'Artist', value: 'artist' },
                    { text: 'Date Added', value: 'dateAdded' }
                ],
                sortDirection: 'asc'
            }
        },
        computed: {
            sortDirectionOptions: function () {
                var criteria = this.sortCriteria;
                var ascOption = { value: 'asc'};
                var descOption = { value: 'desc'};
                switch (criteria) {
                  case "artist":
                      ascOption.text = 'A → Z';
                      descOption.text = 'Z → A';
                      break;
                  case "dateAdded":
                      ascOption.text = 'Old → New';
                      descOption.text = 'New → Old';
                      break;
                }
                return [ascOption, descOption];
            },
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
        watch: {
            sortCriteria: function () {
                this.sortRecords();
            },
            sortDirection: function () {
                this.sortRecords();
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
                            artists: release.basic_information.artists,
                            dateAdded: release.date_added,

                        };
                        records.push(record);
                    });
                    this.allRecords = records;
                    this.sortRecords();
                }
            },
            sortRecords: function () {
                var criteria = this.sortCriteria;
                var isDesc = ( this.sortDirection === 'desc' );
                this.allRecords.sort(function (a, b) {
                    var comparison;
                    switch (criteria) {
                        case "artist":
                            var nameA = a.artists[0].name.toUpperCase().replace('THE ', '');
                            var nameB = b.artists[0].name.toUpperCase().replace('THE ', '');
                            if (nameA > nameB) {
                                comparison = (isDesc ? -1 : 1);
                            } else if (nameA < nameB) {
                                comparison = (isDesc ? 1 : -1);
                            }
                            break;
                        case "dateAdded":
                            if (isDesc) {
                                comparison = new Date(b.dateAdded) - new Date(a.dateAdded);
                            } else {
                                comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
                            }
                            break;
                        default:
                            comparison = 0;
                    }
                    return comparison;
                });
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
    padding-top: 27px;
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

  .wide-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .col { border: 1px solid transparent; }

  .records {
    background: black;
  }
</style>
