<template>
  <div class="record-container" @mouseover="showInfo = true" @mouseout="showInfo = false">
    <b-img fluid-grow v-bind:src="record.imageUrl" class="image"></b-img>
    <div class="overlay">
      <div class="text">
        <div class="font-weight-bold">
          {{ formattedArtists }}
        </div>
        <div class="w-100"></div>
        <div>
          {{ record.title }}
        </div>
        <div class="pt-4">
          <b-button @click="$bvModal.show(modalName)">More info</b-button>
        </div>
      </div>

      <b-modal v-bind:id="modalName" v-bind:title="record.title">
        <RecordInfo v-bind:record="record" v-bind:formattedArtists="formattedArtists"></RecordInfo>
      </b-modal>
    </div>
  </div>
</template>

<script>
    import RecordInfo from "./RecordInfo";
    export default {
        name: "RecordTile",
        components: {RecordInfo},
        props: {
            record: Object,
            id: Number
        },
        data() {
            return {
                showInfo: false
            }
        },
        computed: {
            modalName: function() {
                return "modal-" + this.id;
            },
            formattedArtists: function () {
                var artistArray = [];
                var artistObjects = this.record.artists;
                if (artistObjects) artistObjects.forEach(function (artist) { artistArray.push(artist.name) });

                var artistsString = '';
                var artistCount = artistArray.length;
                if (artistCount === 1) {
                    // Show just the single name.
                    artistsString = artistArray[0];
                } else if (artistCount === 2) {
                    // Show artist 1 + " and " + artist 2.
                    artistsString = artistArray[0] + ' and ' + artistArray[1];
                } else if (artistCount >= 3) {
                    // Show artist comma separated + ", and " + last one.
                    var allArtistNamesButLastOne = [].concat(artistArray);
                    var lastArtistName = allArtistNamesButLastOne.splice(artistCount-1, 1);
                    artistsString = allArtistNamesButLastOne.join(', ') + ', and ' + lastArtistName;
                }
                return artistsString;
            }
        }
    }
</script>

<style scoped>
  .record-container {
    position: relative;
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .2s ease;
    background-color: #000000;
  }

  .record-container:hover .overlay {
    opacity: .9;
  }

  .text {
    color: white;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
