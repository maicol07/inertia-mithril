import m from 'mithril';
import app from './app';

// eslint-disable-next-line consistent-return
export default async function createInertiaApp({
  id = 'app',
  resolve,
  setup,
  title,
  page,
}: {
  id: string,
  resolve: Function,
  setup: Function,
  title: FunctionConstructor,
  page: Object
}) {
  const isServer = typeof window === 'undefined';
  const el = isServer ? null : document.getElementById(id);
  const initialPage = page || JSON.parse(el.dataset.page);

  const resolveComponent = (name: string) => Promise.resolve(resolve(name))
    .then((module) => module.default || module);

  let head = [];
  await resolveComponent(initialPage.component).then(
    (initialComponent: { view: FunctionConstructor }) => {
      app.initialPage = initialPage;
      app.page.component = initialComponent;
      // @ts-ignore
      app.resolveComponent = resolveComponent;
      app.isServer = isServer;
      app.titleCallback = title;
      // @ts-ignore
      app.onHeadUpdate = isServer ? (elements: Array) => {
        head = elements;
        return head;
      } : null;
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
      head,
      body,
    };
  }
}
