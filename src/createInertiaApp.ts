import { m, Mithril } from 'mithril';
import app from './app';

// eslint-disable-next-line consistent-return
export default async function createInertiaApp({
  id = 'app',
  resolve,
  setup,
  title,
  page,
}: {
  id?: string,
  resolve: Function,
  setup: Function,
  // eslint-disable-next-line no-unused-vars
  title: (t: string) => string,
  page?: Object
}) {
  const isServer = typeof window === 'undefined';
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);

  const resolveComponent = (name: string) => Promise.resolve(resolve(name))
    .then((module) => module.default || module);

  await resolveComponent(initialPage.component).then(
    (initialComponent: { title: string, head: Mithril.VnodeDOM, view: FunctionConstructor }) => {
      app.initialPage = initialPage;
      app.page.component = initialComponent;
      app.resolveComponent = resolveComponent;
      app.isServer = isServer;
      app.titleCallback = title;

      return setup({
        el,
        app,
      });
    },
  );

  if (isServer) {
    const body = await m('div', {
      id,
      'data-page': JSON.stringify(initialPage),
    });
    return {
      body,
    };
  }
}
