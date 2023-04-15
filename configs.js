const {QUOTE_API, UNSPLASH_API, UNSPLASH_API_KEY} = require( './keys.json')

module.exports = {
    QUOTE_URL: QUOTE_API,
    UNSPLASH_URL: `${UNSPLASH_API}${UNSPLASH_API_KEY}`
}