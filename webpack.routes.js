const locales = require('./src/config/locales.js');
const contentful = require("contentful");
const CONTENTFUL_CONFIG = require('./src/config/contentful');

const client = contentful.createClient({
  space: CONTENTFUL_CONFIG.SPACE_ID,
  accessToken: CONTENTFUL_CONFIG[process.env.NODE_ENV !== 'production' ? 'DEV_TOKEN' : 'ACCESS_TOKEN'],
  environment: process.env.NODE_ENV !== 'production' ? 'development' : 'master'
});

const buildRoutes = {
  endpoints: {},
  routes: ['/','/404'],

  async getAllRoutes() {
    await client.getEntries({
      "fields.brands.sys.id": CONTENTFUL_CONFIG.BRAND_ID,
      "locale": "*",
      "content_type": 'slugs',
      "select": 'fields.identifier,fields.slug,fields.isEndpoint',
      "fields.identifier[exists]": true,
      "fields.isEndpoint[exists]": true,
      order: "-fields.isEndpoint"
    })
      .then((res) => {
        const defaultLangCode = 'en-US';

        for (let i = 0; i < res.items.length; i++) {
          const item = res.items[i];
          const identifier = item.fields.identifier[defaultLangCode];
          if (identifier === 'home') continue;

          const isEndpoint = item.fields.isEndpoint[defaultLangCode];
          if (!this.endpoints.hasOwnProperty(identifier)) this.endpoints[identifier] = {};

          // allowedLocales is used to filter out slugs that also include fields for different locales.
          let allowedLocales = this.getAllowedLocales();

          for (let key in item.fields.slug) {
            if (!allowedLocales.includes(key)) continue;

            if (isEndpoint) {
              this.endpoints[identifier][key] = item.fields.slug[key];
              this.routes.push(
                "/" + this.getLangByIso(key) +
                "/" + item.fields.slug[key]
              )
            } else {
              this.routes.push(
                "/" + this.getLangByIso(key) +
                "/" + this.endpoints[identifier][key] +
                "/" + item.fields.slug[key]
              )
            }
          }
        }
      })
      .then(() => {
        console.log(this.routes);
      })
      .catch((err) => {
        console.error(err);
      })
  },

  getAllowedLocales() {
    let allowed = [];
    for (let key in locales) {
      allowed.push(locales[key].iso);
    }
    return allowed;
  },

  getLangByIso(iso) {
    for (let key in locales) {
      if (locales[key].iso === iso) return key;
    }
    return 'en';
  },

  getRoutes() {
    for (let key in locales) {
      this.routes.push('/'+key);
    }

    this.routes.push('/404');

    this.getAllRoutes();

    return this.routes;
  }
};

module.exports = buildRoutes.getRoutes();
