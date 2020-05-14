import locales from './config/locales.js'
const contentful = require("contentful");

// const Blog = {template: '<div><h2>Blog Page</h2></div>'};
// const BlogPost = {template: '<div><h2>Blug Slug Page</h2></div>'};

import Home from './pages/home.vue';
import Language from './pages/language.vue';
import About from './pages/about/index.vue';

import Concepts from './pages/concepts/index.vue';
import Concept from './pages/concepts/concept.vue';
import Casestudies from './pages/casestudies/index.vue';
import Casestudy from './pages/casestudies/casestudy.vue';
import News from './pages/news/index.vue';
import NewsItem from './pages/news/news-item.vue';
import Events from './pages/events/index.vue';
import Event from './pages/events/event.vue';

import ProductsIndex from './pages/products/index.vue';
import ProductsHardware from './pages/products/hardware/index.vue';
import ProductsHardwareItem from './pages/products/hardware/item.vue';
import ProductsSoftware from './pages/products/software/index.vue';

import Contact from './pages/contact/index.vue';

import Industries from './pages/industries/index.vue';
import Industry from './pages/industries/industry.vue';

import PrivacyPolicy from './pages/privacy-policy/index.vue';
import FourOhFour from './pages/404.vue';
import Success from './pages/formhandlers/success.vue';
import Error from './pages/formhandlers/error.vue';

let appRoutes = {
  client: contentful.createClient({
    space: process.env.CONTENTFUL.SPACE_ID,
    accessToken: process.env.CONTENTFUL[process.env.NODE_ENV === 'development' ? 'DEV_TOKEN' : 'ACCESS_TOKEN'],
    environment: process.env.NODE_ENV === 'development' ? 'development' : 'master'
  }),

  components: {
    'language': {component: Language},
    'concepts': {component: Concepts, slug: Concept},
    'events': {component: Events, slug: Event},
    'casestudies': {component: Casestudies, slug: Casestudy},
    'news': {component: News, slug: NewsItem},
    'about': {component: About},
    'contact': {component: Contact},
    'industries': {component: Industries, slug: Industry},
    'products': {component: ProductsIndex},
    'hardware': {component: ProductsHardware, slug: ProductsHardwareItem},
    'software': {component: ProductsSoftware},//, slug: ProductsSoftwareItem},
    'privacy-policy': {component: PrivacyPolicy},//, slug: ProductsSoftwareItem},
  },

  routes: [
    // FIXED Routes
    {path: '/', component: Home, name: 'home'},
    {path: '/404', component: FourOhFour, name: '404'},
    {path: '/thanks', component: Success, name: 'success'},
    {path: '/error', component: Error, name: 'error'},
  ],

  async getRoutes() {
    for (let key in locales) {
      this.routes.push({path: '/' + key, component: Home})
    }

    await this.client
      .getEntries({
        "fields.brands.sys.id": process.env.CONTENTFUL.BRAND_ID,
        "locale": "*",
        "content_type": 'slugs',
        "select": 'fields.identifier,fields.slug,fields.isEndpoint',
        "fields.identifier[exists]": true,
        "fields.isEndpoint[exists]": true,
        "fields.isEndpoint": true
      })
      .then((res) => {
        const defaultLangCode = 'en-US';

        res.items.forEach((item) => {
          const identifier = item.fields.identifier[defaultLangCode];

          if (this.components.hasOwnProperty(identifier)) {
            for (let key in item.fields.slug) {

              let lang = key === defaultLangCode ? 'en' : key;
              if (lang === 'zh') lang = 'cn';

              this.routes.push({
                path: '/' + lang + '/' + encodeURI(item.fields.slug[key]),
                component: this.components[identifier].component,
                langIso: key
              });
              if (identifier === 'home') {
                console.log(this.routes[this.routes.length -1])
              }

              if (this.components[identifier].hasOwnProperty("slug")) {
                this.routes.push({
                  path: '/' + lang + '/' + encodeURI(item.fields.slug[key]) + '/:slug',
                  component: this.components[identifier].slug,
                  langIso: key
                });
              }
            }
          }
        })
      })
      .then(() => {
        if (process.env.NODE_ENV !== 'production') {
          this.routes.push({ path: '*', component: FourOhFour })
        }
      })
      .catch((err) => {
        console.error(err);
      })
  },

  getRoute(lang, obj) {
    let iso = locales[lang].iso;

    let component = undefined;
    if (typeof obj === "string") {

      if (typeof this.components[obj] === 'undefined') return;

      component = this.components[obj].component;
    } else if (typeof obj === 'object') {
      component = this.components[obj.identifier][obj.isEndpoint ? 'component' : 'slug'];
    }

    if (typeof component !== 'undefined') {
      for (let index in this.routes) {
        const route = this.routes[index];
        if (route.component === component && route.langIso === iso) {
          if (typeof obj === "string") {
            return route.path;
          } else if (typeof obj === 'object') {
            return obj.isEndpoint ? route.path : route.path.replace(":slug", obj.slug);
          }
        }
      }
    }

    let error = new Error();
    error.statusCode = 404;
    error.message = `Route not found for: ${JSON.stringify(obj)}`;
    throw error;
  },
};

export default appRoutes;
