# osu-showcase-favorite-beatmaps

A website generator that showcases your favorite beatmaps

*Currently a WIP*

## Run

Compile a data file over all your favorite beatmaps:

```sh
npm install
npm run build
npm start
```

Create the website that visualizes this compiled data and makes it searchable:

```sh
npm install
npm run handlebars
npm run webpack
# Run a local webserver
python -m http.server 8000 --directory dist/website/
```

## TODO

- [x] Add eslint and prettier
- [x] Add website (webpack + typescript + handlebars)
- [ ] Add github workflow (for the build process of compiling the beatmap data and the webpack script compilation)
- [ ] Update website search to search for
  - [ ] Ranges for accuracy/score/AR/OR/PP/...
  - [ ] Values higher or lower for accuracy/score/AR/OR/PP/...
- [ ] Externalize the website search to reuse it across different projects and battle test it
- [x] Add a tag filter list so that when compiling the information certain tags are directly removed (smaller file size and less clutter)
- [ ] Update HTML layout and CSS for the entries
- [ ] Remove the mkdir command from the package.json file to make it cross platform and instead implement this via a TS/JS script
- [ ] Add a shell script for an easy local github website deployment
- [ ] Add more favorite maps
- [ ] Update autocomplete implementation to also pick up suggestions when parts of the word to search are recognized

## Script for easy map data aquisition:

You can run this script in the console of the website to easily add a new map to the JSON data file (`Copy Object` with Firefox Dev Tools):


```js
const osuBeatmapId = window.location.href.split("/").pop()
const title = document.querySelector(".beatmapset-header__details-text.beatmapset-header__details-text--title .beatmapset-header__details-text-link").textContent
const artist = document.querySelector(".beatmapset-header__details-text.beatmapset-header__details-text--artist .beatmapset-header__details-text-link").textContent
const stars = document.querySelector(".beatmapset-beatmap-picker__beatmap.beatmapset-beatmap-picker__beatmap--active div").dataset.stars
const rankedStatus = document.querySelector(".beatmapset-status").textContent

console.log({
  comment: `${title}, ${artist}, ${stars}, ${rankedStatus}`,
  osuBeatmapId,
  customTags: []
})
```
