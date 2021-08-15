# osu-showcase-favourite-beatmaps

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

- [ ] Add eslint and prettier
- [ ] Add github workflow (for the build process of compiling the beatmap data and the webpack script compilation)
- [ ] Add website (webpack + typescript + handlebars)
