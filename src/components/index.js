import scParagraphTitle from './sc-paragraph-title.vue'
import scConnector from './sc-design-elements/sc-connector.vue'
import scTriangle from './sc-design-elements/sc-triangle.vue'
import scImage from './sc-image.vue'

const components = [
  scParagraphTitle,
  scConnector,
  scTriangle,
  scImage
];

const customComponents = {
  install(Vue, params) {

    components.forEach((e) => {
      Vue.component(e.name, e);
    });
  }
};

export default customComponents;