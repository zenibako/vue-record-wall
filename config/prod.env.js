'use strict'
module.exports = {
  NODE_ENV: '"production"',
  DISCOGS_TOKEN: JSON.stringify(process.env.DISCOGS_TOKEN),
  SPOTIFY_CLIENT_KEY: JSON.stringify(process.env.SPOTIFY_CLIENT_KEY),
  SPOTIFY_CLIENT_SECRET: JSON.stringify(process.env.SPOTIFY_CLIENT_SECRET),
}
