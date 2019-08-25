<template>
  <div id="app">
    <div class="records" v-if="allRecords.length > 0">
      <b-navbar toggleable="lg" fixed="top" type="light" variant="light">
        <b-navbar-brand href="#">My Record Wall</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="pr-3">
              <b-form-group>
                <b-form-select
                  v-model="selectedSort"
                  name="sort-criteria-select">
                  <optgroup label="Artists">
                    <option :value="{ criteria: 'artist', direction: 'asc' }">Artist: A → Z</option>
                    <option :value="{ criteria: 'artist', direction: 'desc' }">Artist: Z → A</option>
                  </optgroup>
                  <optgroup label="Date Added">
                    <option :value="{ criteria: 'dateAdded', direction: 'asc' }">Date Added: Old → New</option>
                    <option :value="{ criteria: 'dateAdded', direction: 'desc' }">Date Added: New → Old</option>
                  </optgroup>
                </b-form-select>
              </b-form-group>
            </b-nav-form>
          </b-navbar-nav>

          <b-nav-form class="">
            <b-form-input v-model.trim="searchInput" class="mr-sm-2" placeholder="Search Artist/Album..."></b-form-input>
          </b-nav-form>
        </b-collapse>
      </b-navbar>
    </div>

    <div class="records" v-if="allRecords.length > 0">
      <b-container fluid class="wide-container">
        <b-row no-gutters>
          <b-col sm="3" v-for="record in viewRecords" v-bind:key="record.id">
            <RecordTile v-bind:record="record" v-bind:id="record.id"></RecordTile>
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
    import { getRecords }  from '../repository'
    export default {
        name: 'app',
        components: {RecordTile},
        props: {
            inputUserId: '',
            inputCriteria: '',
            inputDirection: ''
        },
        data() {
            return {
                username: 'chanderson90',
                allRecords: [],
                searchInput: '',
                setlistFmResults: [],
                selectedSort: {
                    criteria: 'artist',
                    direction: 'asc'
                }
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
        watch: {
            selectedSort: function (newSort) {
                this.sortRecords(newSort.criteria, newSort.direction);
            },
            inputCriteria: function (criteria) {
                this.setCriteria(criteria);
                if (criteria.length > 0) this.sortRecords(criteria, this.selectedSort.direction);
            },
            inputDirection: function (direction) {
                this.setDirection(direction);
                if (direction.length > 0) this.sortRecords(this.selectedSort.criteria, direction);
            },
        },
        mounted() {
            this.fetchRecordData();
        },
        methods: {
            setCriteria: function (criteria) {
                if (criteria && criteria.length > 0) {
                    console.log("Set criteria: " + criteria);
                    this.selectedSort.criteria = criteria;
                }
            },
            setDirection: function (direction) {
                if (direction && direction.length > 0) {
                    console.log("Set direction: " + direction);
                    this.selectedSort.direction = direction;
                }
            },
            fetchRecordData: function () {
                console.log("Getting records from backend...");
                getRecords()
                    .then(data => this.setRecordData(data.records))
                    .catch((err => alert(err)));
            },
            setRecordData: function (records) {
                console.log("Setting " + records.length + " records...");
                this.allRecords = records;
                this.setCriteria(this.inputCriteria);
                this.setDirection(this.inputDirection);
                this.sortRecords(this.selectedSort.criteria, this.selectedSort.direction);
            },
            // fetchSetlistFmData: function () {
            //     this.getDataFromSetlistFm(process.env.SETLISTFM_USERNAME, this.setDataFromSetlistFm);
            // },
            // getDataFromSetlistFm: function (username, callback) {
            //     console.log("Attempting to get setlists for " + username + "...");
            //
            //     var Setlistfm = require('setlistfm-js');
            //     var setlistfm = new Setlistfm({
            //         key: process.env.SETLISTFM_KEY
            //     });
            //
            //     setlistfm.getUserAttended(username, {
            //         p: 1
            //     })
            //         .then(callback)
            //         .catch(function(error) {
            //             // Returns error
            //         });
            // },
            // setDataFromSetlistFm: function (data) {
            //     console.log("Setlist.fm data returned:");
            //     console.log(data);
            //     this.setlistFmResults = data;
            // },
            sortRecords: function (criteria, direction) {
                var isDesc = ( direction === 'desc' );
                this.allRecords.sort(function (a, b) {
                    var comparison;
                    switch (criteria) {
                        case "artist":
                            var nameA = a.artists[0].name.toUpperCase().replace(/^(THE )/,'');
                            var nameB = b.artists[0].name.toUpperCase().replace(/^(THE )/,'');

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
