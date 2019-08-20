'use strict'
module.exports = {
  NODE_ENV: '"production"',
  DISCOGS_USERNAME: '"chanderson90"',
  DISCOGS_TOKEN: JSON.stringify(process.env.DISCOGS_TOKEN),
  SPOTIFY_CLIENT_KEY: JSON.stringify(process.env.SPOTIFY_CLIENT_KEY),
  SPOTIFY_CLIENT_SECRET: JSON.stringify(process.env.SPOTIFY_CLIENT_SECRET),
  SETLISTFM_USERNAME: JSON.stringify(process.env.SETLISTFM_USERNAME),
  SETLISTFM_KEY: JSON.stringify(process.env.SETLISTFM_KEY)
}
