// noinspection JSUnusedGlobalSymbols

import { createHeadManager, Inertia } from '@inertiajs/inertia';
import m from 'mithril';

const app = {
  initialPage: {
    type: Object,
    required: true,
  },
  isServer: {
    type: Boolean,
    required: false,
    default: false,
  },
  resolveComponent: {
    type: Function,
    required: false,
  },
  titleCallback: {
    type: Function,
    required: false,
    default: (title) => title,
  },
  onHeadUpdate: {
    type: Function,
    required: false,
    default: () => () => {},
  },
  page: {
    component: {
      view: () => m('div'),
    },
    props: {},
    key: null,
  },
  transformProps: (props) => props,
  onCreate: () => {
    createHeadManager(app.isServer, app.titleCallback, app.onHeadUpdate);
    if (!app.isServer) {
      Inertia.init({
        initialPage: app.initialPage,
        resolveComponent: app.resolveComponent,
        swapComponent: ({ component, props, preserveState }) => {
          app.page.component = component;
          app.page.props = app.transformProps(props);
          app.page.key = preserveState ? app.page.key : Date.now();
          m.redraw();
        },
      });
    }
  },
  view: () => m(app.page.component, app.page.props),
};

export default app;
