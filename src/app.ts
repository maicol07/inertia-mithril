// noinspection JSUnusedGlobalSymbols

import { Inertia } from '@inertiajs/inertia';
import m from 'mithril';

const app = {
  initialPage: Object,
  isServer: false,
  resolveComponent: Function,
  titleCallback: (title) => (title),
  page: {
    component: {
      view: () => m('div'),
    },
    props: {
      title: '',
      head: null,
    },
    key: null,
  },
  oncreate: () => {
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
          if (app.page.props.head) {
            m.render(document.head, app.page.props.head);
          }
          // Title callback
          if (app.page.props.title) {
            document.title = app.titleCallback(app.page.props.title);
          }
          app.page.key = preserveState ? app.page.key : Date.now();
          m.redraw();
        },
      });
    }
  },
  view: () => m(app.page.component, app.page.props),
};
export default app;
