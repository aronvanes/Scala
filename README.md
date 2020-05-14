# Vue.js 2.0 + vue-router Prerender Base

Vue Base for the Contentful Websites.

Usage of Vuejs 2.0 with Vue Router and Webpack 3. Building will generate static routes.

## Installing
```
git clone git@git.scala.eu:contentful/sc-base.git
cd /sc-base
npm install
```

### Adding the sc-utils dependency
You will also have to manually add the additional **sc-utils** package. 
There are two options for this;
##### 1 :: Using as a remote "read-only" dependency
> Note that the --no-save is important to keep the dependency out of the package.json file
```
// in the ~/sc-base folder 
 
npm install --no-save git@git.scala.eu:contentful/sc-utils.git
``` 

##### 2 :: Using and editing the sc-utils dependency
To *edit* the sc-utils package, you need to clone its repo outside of the sc-base folder. 
```
git clone git@git.scala.eu:contentful/sc-utils.git
 
cd ./sc-utils
 
npm install
```

Afterwards, you need to add the link from the sc-base to the sc-utils.
```
// in the ~sc-base folder
// reference your local install location of the sc-utils dependency
// Once again with the --no-save to keep it out of the package.json
 
npm install --no-save ~/[your-folder]/sc-utils 
```

## Build

```bash
npm install
npm run build
```

Now check the new `dist` directory for the prerendered static files.

To view the rendered files, install [http-server](https://www.npmjs.com/package/http-server) (`npm install -g http-server`) if you haven't already and run it in the dist directory.

## Development

To view your local development files with hot-reload
```
npm run dev
```

If you've created new routes, you will have to edit the `prerender-spa-plugin` configuration, look for `new PrerenderSPAPlugin` in the plugins section of `webpack.config.js`.

