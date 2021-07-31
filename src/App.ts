/* eslint-disable no-unused-vars */
// noinspection JSUnusedLocalSymbols

import { Inertia } from '@inertiajs/inertia';
import m from 'mithril';

const page = {
  component: {
    view: () => m('div'),
  },
  props: {},
  key: null,
};

export default function App({
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate,
}) {
  return {
    name: 'Inertia',
    onHeadUpdate: () => () => {},
    oncreate: () => {
      const isServer = typeof window === 'undefined';
      // const headManager = createHeadManager(isServer, titleCallback, onHeadUpdate);

      if (!isServer) {
        Inertia.init({
          initialPage,
          resolveComponent,
          async swapComponent(args) {
          // page = args.page;
          // @ts-ignore
            page.component = args.component;
            page.key = args.preserveState ? page.key : Date.now();
          },
          // @ts-ignore
          updatePage(component, props, { preserveState }) {
            page.component = component;
            page.props = props;
            page.key = preserveState ? page.key : Date.now();
            m.redraw();
          },
        });
      }
    },
    view: () => m(page.component, page.props),

  };
}
