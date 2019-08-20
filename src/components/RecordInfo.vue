<template>
  <div>
    <p v-for="note in notes">
      {{ note }}
    </p>
  </div>
</template>

<script>
    export default {
        name: "RecordInfo",
        props: {
            record: Object,
            id: Number,
            formattedArtists: String,
        },
        data() {
            return {
                spotifyResults: []
            }
        },
        computed: {
            notes: function () {
                var noteArray = [];
                var notesOnRecord = this.record.notes || [];
                notesOnRecord.forEach(function (note) {
                  noteArray.push(note.value);
                });
                return noteArray;
            }
        },
        mounted() {
            this.fetchSpotifyData();
        },
        methods: {
            fetchSpotifyData: function () {
                var searchQuery = this.record.title + " " + this.formattedArtists;
                this.searchSpotify(searchQuery, this.setDataFromDiscogs);
            },
            searchSpotify: function (searchQuery, callback) {
                // console.log("Attempting to search for " + searchQuery + "...");

                // var Spotify = require('node-spotify-api');
                // var spotify = new Spotify({
                //     id: '',
                //     secret: ''
                // });

                //spotify.search({ type: 'artist OR album', query: searchQuery }, callback);
            },
            setDataFromSpotify: function (err, data) {
                console.log("Spotify data returned:");
                console.log(data);
                this.spotifyResults = data;
            }
        }
    }
</script>

<style scoped>

</style>
