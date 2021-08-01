// noinspection JSUnusedGlobalSymbols

import { createHeadManager, Inertia } from '@inertiajs/inertia';
import m from 'mithril';

const app = {
  initialPage: Object,
  isServer: false,
  resolveComponent: Function,
  titleCallback: (title) => (title),
  onHeadUpdate: Function,
  page: {
    component: {
      view: () => m('div'),
    },
    props: {},
    key: null,
  },
  onCreate: () => {
    // @ts-ignore
    createHeadManager(app.isServer, app.titleCallback, app.onHeadUpdate);

    if (!app.isServer) {
      Inertia.init({
        // @ts-ignore
        initialPage: app.initialPage,
        resolveComponent: app.resolveComponent,
        // @ts-ignore
        swapComponent: ({
          component,
          page,
          preserveState,
        }) => {
          // @ts-ignore
          app.page = page;
          // @ts-ignore
          app.page.component = component;
          app.page.key = preserveState ? app.page.key : Date.now();
          m.redraw();
        },
      });
    }
  },
  view: () => m(app.page.component, app.page.props),
};
export default app;
